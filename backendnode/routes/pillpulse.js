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

module.exports = pillPulseRouter;