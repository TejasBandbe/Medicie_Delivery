const express = require('express');
const pillPulseRouter = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { constants } = require('../env');
require('dotenv').config();

//function to executecute mysql queries
function executeQuery(statement){
    return new Promise((resolve, reject) => {
        db.query(statement, (error, data) => {
            if(error){
                reject(error);
            }else{
                resolve(data);
            }
        });
    });
};

// ========================================================================
// users controller
// ========================================================================

// function to generate OTP
function generateOTP() {
    const otp = Math.floor(1000 + Math.random() * 9000);
    return otp.toString();
}

const sendOTP = (otp, emailId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: constants.USER,
            pass: constants.PASS
        }
    });

    const message = `
Dear user,

This is your OTP to complete the regisration process.

${otp}


Thank you,
PillPulse Team
`;

    const mailOptions = {
        from: constants.USER,
        to: emailId,
        subject: 'Verify Your Email Id',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            response.status(400).send({error:'Internal Server Error'});
        }else{
        }
    });
};

//api to register the user
pillPulseRouter.post('/users/register', async(request, response) => {
    try{
        const {name, age, emailId, password, mobNo, address, pincode} = request.body;

        var statement = `select id from pillpulse_users where (email_id = '${emailId}' or mob_no = '${mobNo}') and status = 'active'`;
        var data = await executeQuery(statement);
        if(data.length !== 0){
            response.status(200).send({message: "email id or mobile number already registered"});
            return;
        }
        const otp = generateOTP();
        sendOTP(otp, emailId);

        const hashedPassword = await bcrypt.hash(password, 10);

        statement = `insert into pillpulse_users values(default, '${name}', ${age}, '${emailId}', 
        '${hashedPassword}', '${mobNo}', '${address}', '${pincode}', default, default, 
        'inactive', ${otp}, default)`;
        data = await executeQuery(statement);

        
        
        if(data){
            response.status(201).send({message: "registration pending. check your inbox.", "id": data.insertId});
        }else{
            response.status(200).send({"error": "something went wrong"});
        }
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/completeregistration', async(request, response) => {
    try{
        var statement = `select otp from pillpulse_users where id = ${request.body.userId}`;
        var data = await executeQuery(statement);
        if(data[0].otp === request.body.otp){
            statement = `update pillpulse_users set otp = null, status = 'active' 
            where id = ${request.body.userId}`;
            data = await executeQuery(statement);
            if(data.affectedRows === 1){
                response.status(200).send({message: "registration complete", "id": request.body.userId});
            }else{
                response.status(400).send({"error": "something went wrong"});
            }
        }else{
            statement = `delete from pillpulse_users where id = ${request.body.userId}`;
            executeQuery(statement);
            response.status(400).send({"error": "something went wrong"});
        }
    }catch(error){
        response.status(400).send({"error": error});
    }
});

//api to login the user
pillPulseRouter.post('/users/login', async(request, response) => {
    try{
        const {email, password} = request.body;
        var statement = `select id, password from pillpulse_users where email_id = '${email}' and role = 'user' and status = 'active'`;
        var data = await executeQuery(statement);
        if(data.length === 0){
            response.status(200).send({"error": "user not found. please check your email id."});
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, data[0].password);
        if(!isPasswordValid){
            response.status(200).send({"error": "entered password is wrong"});
            return;
        }

        const payload = {"user_id": data[0].id, "role": "user"};
        jwt.sign({payload}, process.env.JWTKEY, {expiresIn: constants.JWT_KEY_EXPIRY_TIME}, (err, token) => {
            if(err){
                response.status(500).send({"error": "user not found"});
            }else{
                response.status(200).send({"user_id": data[0].id, "token": token});
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

//function to generate random password
function generatePassword() {
    const length = constants.FORGET_PASSWORD_LENGHT;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
  
    return password;
}

//api for forget password
pillPulseRouter.post('/users/forgetPass', async(request, response) => {
    try{
        const { email } = request.body;
        const newPassword = generatePassword();
        var statement = `select name from pillpulse_users where email_id = '${email}'`;
        var data = await executeQuery(statement);
        if(data.length === 0){
            response.status(200).send({"error": "user not found. please check your email id."});
            return;
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        statement = `update pillpulse_users set password = '${hashedPassword}' 
        where email_id = '${email}'`;
        data = await executeQuery(statement);
        if(data.affectedRows === 0){
            response.status(200).send({"error": "something went wrong"});
        }else{
            const mailid = request.body.email;
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: constants.USER,
                    pass: constants.PASS
                }
            });

    const message = `
Dear user,

We received a request to reset your password for your PillPulse account.
This is your temporary password is:

${newPassword}

We recommend you to login using this password and change the password in Profile tab.

Thank you,
PillPulse Team
`;

            const mailOptions = {
                from: constants.USER,
                to: mailid,
                subject: 'Password Reset Request',
                text: message,
            };

            transporter.sendMail(mailOptions, (error, info) =>{
                if(error){
                    response.status(200).send({error:'Internal Server Error'});
                }else{
                    response.status(400).send({"message": "password sent via email"});
                }
            });
        }

    }catch(error){
        response.status(400).send({"error": error});
    }
});

//function to verify token and get payload
function verifyToken(request, response, next){
    const header = request.headers['authorization'];
    if(typeof header !== 'undefined'){
        const bearer = header.split(" ");
        const token = bearer[1];
        request.token = token;
        next();
    }else{
        response.status(401).send({"error": "token not found"});
    }
};

pillPulseRouter.post('/users/verifyToken', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        response.status(200).send({"isLoggedIn": true});
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getprofile', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        var statement = `select * from pillpulse_users where id = ${request.body.userId}`;
                        var data = await executeQuery(statement);
                        response.status(200).send(data);
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/editprofile', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        const { name, age, emailId, mobNo, address, pincode } = request.body;
                        var statement = `update pillpulse_users set name = '${name}', age = ${age},
                        email_id = '${emailId}', mob_no = '${mobNo}', address = '${address}', 
                        pincode = '${pincode}' where id = ${request.body.userId}`;
                        var data = await executeQuery(statement);
                        if(data.affectedRows === 1){
                            response.status(200).send(data);
                        }else{
                            response.status(400).send({"error": "Something went wrong"});
                        }
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

const sendEmailOTP = (otp, emailId) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: constants.USER,
            pass: constants.PASS
        }
    });

    const message = `
Dear user,

This is your OTP to complete the regisration process.

${otp}


Thank you,
PillPulse Team
`;

    const mailOptions = {
        from: constants.USER,
        to: emailId,
        subject: 'Verify Your Email Id',
        text: message,
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            response.status(400).send({"error": "Email not sent"});
            // return false;
        }else{
            // return true;
        }
    });
};

pillPulseRouter.post('/users/sendemailotp', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select id from pillpulse_users where email_id = '${request.body.emailId}'`;
        var uid = await executeQuery(statement);
        if(uid.length === 0){
            var otp = generateOTP();
            sendEmailOTP(otp, request.body.emailId);

            var statement = `update pillpulse_users set otp = ${otp} where id = ${request.body.userId}`;
            var data = await executeQuery(statement);
            if(data.affectedRows === 1){
                response.status(200).send({"message": "Otp sent via email", "emailId": request.body.emailId});
            }
            return;
        }
        
        uid = uid[0].id;
        if(uid == authData.payload.user_id){
            response.status(200).send({message: "Email id is same as previous"});
            return;
        }else{
            response.status(200).send({"error": "This email id is already registered"});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/completeemailchange', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select otp from pillpulse_users where id = ${request.body.userId}`;
        var data = await executeQuery(statement);
        var OTP = data[0].otp;

        if(OTP === request.body.otp){
            statement = `update pillpulse_users set otp = null, email_id = '${request.body.emailId}' 
            where id = ${request.body.userId}`;
            data = await executeQuery(statement);
            if(data.affectedRows === 1){
                response.status(200).send({message: "Email id updated successfully."});
            }else{
                response.status(200).send({"error": "Something went wrong."});
            }
        }else{
            response.status(200).send({"error": "OTP is wrong. Please try again."});
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/updatepassword', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select password from pillpulse_users where id = ${request.body.userId}`;
        var data = await executeQuery(statement);
        var curPass = data[0].password;

        const isPasswordValid = await bcrypt.compare(request.body.oldPass, curPass);
        if(!isPasswordValid){
            response.status(200).send({"error": "Entered old password is wrong"});
            return;
        }else{
            const hashedPassword = await bcrypt.hash(request.body.newPass, 10);
            statement = `update pillpulse_users set password = '${hashedPassword}' where id = ${request.body.userId}`;
            data = await executeQuery(statement);
            if(data.affectedRows === 1){
                response.status(200).send({message: "Password updated successfully"});
                return;
            }else{
                response.status(200).send({"error": "Something went wrong"});
                return;
            }
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
                }catch(error){
                    response.status(200).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/deactivate', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `update pillpulse_users set status = 'inactive' where id = ${request.body.userId}`;
        var data = await executeQuery(statement);
        if(data.affectedRows === 1){
            response.status(200).send({message: "Account deactivated"});
            return;
        }
        else{
            response.status(200).send({"error": "Something went wrong"});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/home', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        var statement = `select * from medicines`;
                        var data = await executeQuery(statement);
                        response.status(200).send(data);
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getmedbycat', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        var statement = `select * from medicines where category = '${request.body.category}'`;
                        var data = await executeQuery(statement);
                        response.status(200).send(data);
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                    
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getmedbyid/:id', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
                try{
                    if(authData.payload.user_id == request.body.userId){
                        var statement = `select * from medicines where id = ${request.params.id}`;
                        var data = await executeQuery(statement);
                        response.status(200).send(data);
                    }
                    else{
                        response.status(401).send({"error": "Invalid token"});
                    }
                }catch(error){
                    response.status(400).send({"error": error});
                }
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/addtocart', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var {userId, prodId, unitPrice, discount} = request.body;
        var statement = `select id from cart where medicine_id = ${prodId} and user_id = ${userId}`;
        var data = await executeQuery(statement);
        if(data.length !== 0){
            response.status(200).send({"error": "Item already present in cart."});
            return;
        }

        statement = `insert into cart values(default, ${userId}, ${prodId}, ${unitPrice},
            ${discount}, default, default, default, default)`;
        data = await executeQuery(statement);
        response.status(200).send(data);
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getcart', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select m.id as 'prodId', m.name, m.manufacturer, m.category, m.description, 
        m.image, m.exp_date, c.id as 'cartId', c.unit_price, c.discount, c.quantity, c.total 
        from cart c, medicines m where c.medicine_id = m.id and c.user_id = ${request.body.userId};`;
        var data = await executeQuery(statement);
        response.status(200).send(data);
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/cart/increase', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var {cartId, quantity, userId} = request.body;
        var statement = `select m.available_qty, c.quantity from medicines m, cart c where m.id = c.medicine_id and m.id = 
        (select medicine_id from cart where id = ${cartId});`;
        var data = await executeQuery(statement);
        var available_qty = data[0].available_qty;

        if(quantity < available_qty){
            statement = `update cart set quantity = quantity + 1, 
            total = round((unit_price*(1-discount)*quantity), 2) where id = ${cartId}`;
            await executeQuery(statement);

            statement = `select m.id as 'prodId', m.name, m.manufacturer, m.category, m.description, 
            m.image, m.exp_date, c.id as 'cartId', c.unit_price, c.discount, c.quantity, c.total 
            from cart c, medicines m where c.medicine_id = m.id and c.user_id = ${userId};`;
            var data = await executeQuery(statement);
            response.status(200).send(data);
        }else{
            response.status(200).send({message: "Reached maximum quantity."});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/cart/decrease', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var {cartId, quantity, userId} = request.body;

        if(quantity > 1){
            statement = `update cart set quantity = quantity - 1, 
            total = round((unit_price*(1-discount)*quantity), 2) where id = ${cartId}`;
            await executeQuery(statement);

            statement = `select m.id as 'prodId', m.name, m.manufacturer, m.category, m.description, 
            m.image, m.exp_date, c.id as 'cartId', c.unit_price, c.discount, c.quantity, c.total 
            from cart c, medicines m where c.medicine_id = m.id and c.user_id = ${userId};`;
            var data = await executeQuery(statement);
            response.status(200).send(data);
        }else{
            response.status(200).send({message: "Reached minimum quantity."});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/cart/remove', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `delete from cart where id = ${request.body.cartId}`;
        var data = await executeQuery(statement);
        if(data.affectedRows === 1){
            statement = `select m.id as 'prodId', m.name, m.manufacturer, m.category, m.description, 
            m.image, m.exp_date, c.id as 'cartId', c.unit_price, c.discount, c.quantity, c.total 
            from cart c, medicines m where c.medicine_id = m.id and c.user_id = ${request.body.userId};`;
            var data = await executeQuery(statement);
            response.status(200).send(data);
            return;
        }else{
            response.status(200).send({"error": "Something went wrong"});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});


pillPulseRouter.post('/users/addlike', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const {userId, prodId} = request.body;
        var statement = `select id from likes where user_id = ${userId} and medicine_id = ${prodId}`;
        var data = await executeQuery(statement);
        if(data.length === 0){
            statement = `insert into likes values(default, ${prodId}, ${userId})`;
            await executeQuery(statement);
            response.status(200).send({message: "Added to favourites."});
            return;
        }else{
            response.status(200).send({message: "Already added to favourites."});
            return;
        }
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/removelike', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const {likeId} = request.body;
        var statement = `delete from likes where id = ${likeId}`;
        await executeQuery(statement);
        response.status(200).send({message: "Removed from favourites."});
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/removethislike', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const {userId, prodId} = request.body;
        var statement = `delete from likes where medicine_id = ${prodId} and user_id = ${userId}`;
        await executeQuery(statement);
        response.status(200).send({message: "Removed from favourites."});
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getlikes', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const { userId } = request.body;
        var statement = `select id, medicine_id from likes where user_id = ${userId} order by medicine_id`;
        var data = await executeQuery(statement);
        response.status(200).send(data);
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getlikesbyid', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const { userId, prodId } = request.body;
        var statement = `select id from likes 
        where user_id = ${userId} and medicine_id = ${prodId}`;
        var data = await executeQuery(statement);
        response.status(200).send(data);
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});


const generateOrderNumber = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString().slice(-2);
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');

    return `${year}${month}${day}-`;
};

pillPulseRouter.post('/users/placeorder', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        const { userId, totalAmt } = request.body;
        var orderNo = generateOrderNumber();
        var statement = `insert into orders(user_id, order_no, order_total) 
        values (${userId}, '${orderNo}', ${totalAmt})`;
        var data = await executeQuery(statement);
        var insertId = data.insertId;

        statement = `select count(id) count from orders where date(o_timestamp) = date(now())`;
        var data = await executeQuery(statement);
        var paddedNumber = (data[0].count).toString().padStart(5, '0');
        orderNo = `${orderNo}${paddedNumber}`;

        statement = `update orders set order_no = '${orderNo}' where id = ${insertId}`;
        await executeQuery(statement);

        insertIntoOrderItems(userId, insertId, response);

        // response.status(200).send({message: "order placed", orderNo});
    }
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

const insertIntoOrderItems = async(userId, orderId, response) => {
    try{
        var statement = `select * from cart where user_id = ${userId}`;
        var data = await executeQuery(statement);

        for(var i = 0; i < data.length; i++){
            var { medicine_id, unit_price, discount, quantity, total } = data[i];
            statement = `insert into order_items values(default, ${orderId}, ${medicine_id},
                ${unit_price}, ${discount}, ${quantity}, ${total}, default, default)`;
            await executeQuery(statement);
        }

        deleteFromCart(userId, orderId, response);
    }catch(error){
        response.status(400).send({"error": error});
    }
};

const deleteFromCart = async(userId, orderId, response) => {
    try{
        var statement = `delete from cart where user_id = ${userId}`;
        await executeQuery(statement);

        decrementQuantity(orderId, response);
    }catch(error){
        response.status(400).send({"error": error});
    }
};

const decrementQuantity = async(orderId, response) => {
    try{
        var statement = `select * from order_items where order_id = ${orderId}`;
        var data = await executeQuery(statement);

        for(var i=0; i<data.length; i++){
            var qtyToDecrease = data[i].quantity;
            var medId = data[i].medicine_id;
            statement = `update medicines set available_qty = available_qty - ${qtyToDecrease}
            where id = ${medId}`;
            await executeQuery(statement);
        }

        sendOrderMail(orderId, response);
    }catch(error){
        response.status(400).send({"error": error});
    }
};

const sendOrderMail = async(orderId, response) => {
    try{
        var statement = `select o.order_no, u.name userName, u.email_id, u.mob_no, u.address, 
        u.pincode, m.name medicineName, m.manufacturer, oi.unit_price, oi.discount, oi.quantity, 
        oi.total, o.order_total, m.exp_date, o.o_timestamp, o.d_timestamp, o.order_status
        from order_items oi, orders o, pillpulse_users u, medicines m
        where oi.order_id = o.id and oi.medicine_id = m.id and o.user_id = u.id 
        and o.id = ${orderId}`;
        var data = await executeQuery(statement);

        const orderTime = data[0].o_timestamp.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });

        const deliveryTime = data[0].d_timestamp.toLocaleString('en-US', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });

        const orderNo = data[0].order_no;
        const orderTotal = data[0].order_total;
        var tableData = ``;
        for(var i=0; i<data.length; i++){
            tableData += `<tr><td>${data[i].medicineName}</td><td>${data[i].quantity}</td><td>₹ ${data[i].unit_price}</td><td>₹ ${data[i].total}</td></tr>`;
        }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: constants.USER,
            pass: constants.PASS
        }
    });

    const message = `
Dear <strong>${data[0].userName}</strong>,<br/><br/>

Thank you for choosing <strong>PillPulse</strong> for your medicine needs.<br/>
We are pleased to confirm the receipt of your order <strong>#${data[0].order_no}</strong> placed on ${orderTime}.
<br/><br/>
<strong>Order details:</strong><br/>
<table border='1'><tr><td><h3>Medicine</h3></td><td><h3>Quantity</h3></td><td><h3>Unit Price</h3></td><td><h3>Total</h3></td></tr>
${tableData}
</table>
<br/><br/>
<strong>Delivery Address:</strong> ${data[0].address} - ${data[0].pincode}<br/>
<strong>Delivery Date:</strong> ${deliveryTime}<br/>
<strong>Total Amount:</strong> ₹ ${data[0].order_total}<br/><br/>

We will notify you once your order has been dispatched for delivery.<br/><br/>

If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.
<br/><br/>
Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!
<br/><br/>
Thank you,<br/>
PillPulse Team<br/><br/>
`;

    const mailOptions = {
        from: constants.USER,
        to: data[0].email_id,
        subject: `Order Confirmation - #${data[0].order_no}`,
        html: message,
    };

    transporter.sendMail(mailOptions, (error, info) =>{
        if(error){
            response.status(400).send({"error": "Email not sent"});
            // return false;
        }else{
            // return true;
            response.status(200).send({message: "order placed", orderNo, deliveryTime, orderTotal});
        }
    });
    }catch(error){
        response.status(400).send({"error": error});
    }
};

pillPulseRouter.post('/users/myorders', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select o.order_no, u.name userName, u.email_id, u.mob_no, u.address, 
        u.pincode, m.name medicineName, m.manufacturer, m.image, oi.unit_price, oi.discount, oi.quantity, 
        oi.total, o.order_total, m.exp_date, o.o_timestamp, o.d_timestamp, o.order_status
        from order_items oi, orders o, pillpulse_users u, medicines m
        where oi.order_id = o.id and oi.medicine_id = m.id and o.user_id = u.id 
        and o.user_id = ${request.body.userId}`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/getorder', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select o.order_no, u.name userName, u.email_id, u.mob_no, u.address, 
        u.pincode, m.name medicineName, m.manufacturer, m.image, m.description, oi.unit_price, oi.discount, oi.quantity, 
        oi.total, o.order_total, m.exp_date, o.o_timestamp, o.d_timestamp, o.order_status
        from order_items oi, orders o, pillpulse_users u, medicines m
        where oi.order_id = o.id and oi.medicine_id = m.id and o.user_id = u.id 
        and o.order_no = '${request.body.orderNo}'`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/myorders', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select o.order_no, u.name userName, u.email_id, u.mob_no, u.address, 
        u.pincode, m.name medicineName, m.manufacturer, m.image, oi.unit_price, oi.discount, oi.quantity, 
        oi.total, o.order_total, m.exp_date, o.o_timestamp, o.d_timestamp, o.order_status
        from order_items oi, orders o, pillpulse_users u, medicines m
        where oi.order_id = o.id and oi.medicine_id = m.id and o.user_id = u.id 
        and o.user_id = ${request.body.userId}`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/users/cancelorder', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select id from orders where order_no = '${request.body.orderNo}'`;
        var data = await executeQuery(statement);
        var orderId = data[0].id;

        statement = `update orders set order_status = 'cancelled' where id = ${orderId}`;
        await executeQuery(statement);

        updateQty(orderId, response);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

const updateQty = async(orderId, response) => {
    try{
        var statement = `select * from order_items where order_id = ${orderId}`;
        var data = await executeQuery(statement);

        for(var i=0; i<data.length; i++){
            var qtyToIncrease = data[i].quantity;
            var medId = data[i].medicine_id;
            statement = `update medicines set available_qty = available_qty + ${qtyToIncrease}
            where id = ${medId}`;
            await executeQuery(statement);
        }

        response.status(200).send({message: 'order cancelled'});
    }catch(error){
        response.status(400).send({"error": error});
    }
};

// ========================================================================
// delivery person controller
// ========================================================================

//api to register the delivery person
pillPulseRouter.post('/delivery/register', async(request, response) => {
    try{
        const {name, emailId, password, mobNo, address, pincode} = request.body;

        var statement = `select id from pillpulse_users where email_id = '${emailId}' or mob_no = '${mobNo}'`;
        var data = await executeQuery(statement);

        if(data.length != 0){
            response.status(200).send({message: "email id or mobile number already registered"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        statement = `insert into pillpulse_users values(default, '${name}', 0, '${emailId}', 
        '${hashedPassword}', '${mobNo}', '${address}', '${pincode}', 'delivery', default, 
        default, default, default)`;
        data = await executeQuery(statement);
        
        if(data){
            response.status(201).send({message: "registered successfully", "id": data.insertId});
        }else{
            response.status(200).send({"error": "something went wrong"});
        }
    }catch(error){
        response.status(400).send({"error": error});
    }
});

//api to login the delivery person
pillPulseRouter.post('/delivery/login', async(request, response) => {
    try{
        const {email, password} = request.body;
        var statement = `select id, password from pillpulse_users where email_id = '${email}' and role = 'delivery'`;
        var data = await executeQuery(statement);
        if(data.length === 0){
            response.status(200).send({"error": "user not found. please check your email id."});
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, data[0].password);
        if(!isPasswordValid){
            response.status(200).send({"error": "entered password is wrong"});
            return;
        }

        const payload = {"user_id": data[0].id, "role": "delivery"};
        jwt.sign({payload}, process.env.JWTKEY, {expiresIn: constants.JWT_KEY_EXPIRY_TIME}, (err, token) => {
            if(err){
                response.status(500).send({"error": "user not found"});
            }else{
                response.status(200).send({"user_id": data[0].id, "token": token});
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/delivery/pendingdeliveries', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select o.id orderId, o.order_no, o.user_id, o.order_total, 
        o.order_status, u.name username, u.address, u.pincode, u.mob_no, m.name medicineName
        from delivery d, orders o, pillpulse_users u, order_items oi, medicines m
        where o.id = d.order_id and o.user_id = u.id and o.id = oi.order_id 
        and oi.medicine_id = m.id
        and d.user_id = ${request.body.userId} and o.order_status = 'ordered'`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/delivery/totaldeliveries', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `select count(o.id) deliveries
        from orders o, delivery d
        where o.id = d.order_id and o.order_status = 'delivered' and d.user_id = ${request.body.userId}`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/delivery/completedelivery', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId){
        var statement = `update orders set order_status = 'delivered' 
        where id = ${request.body.orderId}`;
        var data = await executeQuery(statement);

        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

// ========================================================================
// admin controller
// ========================================================================

//api to register the admin
pillPulseRouter.post('/admin/register', async(request, response) => {
    try{
        const {name, emailId, password, mobNo} = request.body;

        var statement = `select id from pillpulse_users where email_id = '${emailId}' or mob_no = '${mobNo}'`;
        var data = await executeQuery(statement);

        if(data.length != 0){
            response.status(200).send({message: "email id or mobile number already registered"});
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        statement = `insert into pillpulse_users values(default, '${name}', 0, '${emailId}', 
        '${hashedPassword}', '${mobNo}', '-', '-', 'admin', default, 
        default, default, default)`;
        data = await executeQuery(statement);
        
        if(data){
            response.status(201).send({message: "registered successfully", "id": data.insertId});
        }else{
            response.status(200).send({"error": "something went wrong"});
        }
    }catch(error){
        response.status(400).send({"error": error});
    }
});

//api to login the delivery person
pillPulseRouter.post('/admin/login', async(request, response) => {
    try{
        const {email, password} = request.body;
        var statement = `select id, password from pillpulse_users where email_id = '${email}' and role = 'admin'`;
        var data = await executeQuery(statement);
        if(data.length === 0){
            response.status(200).send({"error": "user not found. please check your email id."});
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, data[0].password);
        if(!isPasswordValid){
            response.status(200).send({"error": "entered password is wrong"});
            return;
        }

        const payload = {"user_id": data[0].id, "role": "admin"};
        jwt.sign({payload}, process.env.JWTKEY, {expiresIn: constants.JWT_KEY_EXPIRY_TIME}, (err, token) => {
            if(err){
                response.status(500).send({"error": "user not found"});
            }else{
                response.status(200).send({"user_id": data[0].id, "token": token});
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/getcards', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        var statement = `select
        count(case when role = 'user' then id end) as customers,
        count(case when role = 'delivery' then id end) as delivery
        from  pillpulse_users where role in ('user', 'delivery')`;
        
        var data = await executeQuery(statement);
        var customers = data[0].customers;
        var delivery = data[0].delivery;

        statement = `select count(id) medicines from medicines`;
        data = await executeQuery(statement);
        var medicines = data[0].medicines;

        statement = `select round(sum(order_total), 2) revenue from orders where order_status = 'delivered'`;
        data = await executeQuery(statement);
        var revenue = data[0].revenue;
        
        response.status(200).send({customers, delivery, medicines, revenue});
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/getorders', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        var statement = `select o.id, o.order_no, u.address, u.pincode from orders o, pillpulse_users u
        where o.user_id = u.id and o.order_status = 'ordered' and o.id not in 
        (select distinct(order_id) from delivery)`;
        
        var data = await executeQuery(statement);
        
        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/getdeliverynames', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        var statement = `select id, name from pillpulse_users where role = 'delivery'`;
        
        var data = await executeQuery(statement);
        
        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/assigndelivery', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        const {deliveryPersonId, orderId} = request.body;
        var statement = `select id from delivery where order_id = ${orderId}`;
        var data = await executeQuery(statement);
        if(data.length !== 0){
            response.status(200).send({"message": "already assigned"});
            return;
        }
        statement = `insert into delivery values(default, ${orderId}, ${deliveryPersonId})`;
        data= await executeQuery(statement);
        
        response.status(200).send({message: 'assigned'});
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/getproducts', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        var statement = `select m.id, m.name, m.manufacturer, m.category, m.description, m.unit_price, m.discount, m.available_qty, m.exp_date, m.image, m.status,
        count(l.medicine_id) likes, 
        count(case when o.order_status = 'delivered' then oi.medicine_id when o.order_status = 'ordered' then oi.medicine_id end) as oicount
        from medicines m left join likes l on m.id = l.medicine_id 
        left join order_items oi on oi.medicine_id = m.id
        left join orders o on oi.order_id = o.id
        group by m.id, m.name, m.manufacturer, m.category, m.description, m.unit_price, m.discount, m.available_qty, m.exp_date, m.image, m.status`;
        var data = await executeQuery(statement);
        
        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});

pillPulseRouter.post('/admin/getproductbyid', verifyToken, async(request, response) => {
    try{
        jwt.verify(request.token, process.env.JWTKEY, async(error, authData) => {
            if(error){
                response.status(401).send({"error": "Invalid token or JWT Key not provided"});
                // response.status(401).send({"error": error});
            }else{
try{
    if(authData.payload.user_id == request.body.userId  && authData.payload.role === 'admin'){
        var statement = `select m.id, m.name, m.manufacturer, m.category, m.description, m.unit_price, m.discount, m.available_qty, m.exp_date, m.image, m.status,
        count(l.medicine_id) likes, 
        count(case when o.order_status = 'delivered' then oi.medicine_id when o.order_status = 'ordered' then oi.medicine_id end) as oicount
        from medicines m left join likes l on m.id = l.medicine_id 
        left join order_items oi on oi.medicine_id = m.id
        left join orders o on oi.order_id = o.id
        where m.id = ${request.body.prodId}
        group by m.id, m.name, m.manufacturer, m.category, m.description, m.unit_price, m.discount, m.available_qty, m.exp_date, m.image, m.status`;
        var data = await executeQuery(statement);
        
        response.status(200).send(data);
    }   
    else{
        response.status(401).send({"error": "Invalid token"});
    }
}catch(error){
    response.status(400).send({"error": error});
}
            }
        })
    }catch(error){
        response.status(400).send({"error": error});
    }
});


module.exports = pillPulseRouter;