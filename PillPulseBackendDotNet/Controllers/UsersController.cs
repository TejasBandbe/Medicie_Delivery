using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.JsonPatch;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MimeKit.Text;
using PillPulse.Data;
using PillPulse.Models;
using System.Security.Claims;

namespace PillPulseBackendDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly PillPulseContext _context;
        private readonly IConfiguration _config;

        public UsersController(PillPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register([FromBody] User user)
        {
            try
            {
                _context.Users.Add(user);
                var result = await _context.SaveChangesAsync();
                if(result == 1)
                {
                    return Ok(new { message = "user registered", user });
                }
                return BadRequest(new { error = "registration failed" });
            }
            catch (Exception ex)
            {
                return NotFound(new {error = "something went wrong", ex.Message });
            }
        }

        private User GetCurrentUser()
        {
            var identity = HttpContext.User.Identity as ClaimsIdentity;
            if(identity != null)
            {
                var userClaims = identity.Claims;

                return new User
                {
                    Name = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.NameIdentifier)?.Value,
                    Role = userClaims.FirstOrDefault(u => u.Type == ClaimTypes.Role)?.Value
                };
            }
            return null;
        }

        [HttpGet("{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> GetProfile([FromRoute] int id)
        {
            try
            {
                var currentUser = GetCurrentUser();
                var userInfo = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if(userInfo != null && currentUser != null)
                {
                    return Ok(new { userInfo, currentUser.Name, currentUser.Role });
                }
                return NotFound("something went wrong");
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> EditProfile([FromRoute] int id, [FromBody] User user)
        {
            try
            {
                var userToEdit = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if(userToEdit != null){
                    userToEdit.Name = user.Name;
                    userToEdit.Age = user.Age;
                    userToEdit.EmailId = user.EmailId;
                    userToEdit.Address = user.Address;
                    userToEdit.Pincode = user.Pincode;
                    userToEdit.MobNo = user.MobNo;

                    var result = await _context.SaveChangesAsync();
                    if(result == 1)
                    {
                        return Ok(new { message = "profile updated" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new { error = "user not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("changepass/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> ChangePassword([FromRoute] int id, [FromBody] string password)
        {
            try
            {
                var userToEdit = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if(userToEdit != null){
                    userToEdit.Password = password;
                    var result = await _context.SaveChangesAsync();
                    if (result == 1)
                    {
                        return Ok(new { message = "password updated" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new { error = "user not found" });
            }
            catch (Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("deactivate/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> Deactivate([FromRoute] int id)
        {
            try{
                var userToEdit = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
                if(userToEdit != null)
                {
                    userToEdit.Status = "inactive";
                    var result = await _context.SaveChangesAsync();
                    if(result == 1){
                        return Ok(new { message = "account deleted" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new { error = "user not found" });
            }catch(Exception ex){
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("medicines")]
        [Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetAllMedicines()
        {
            try
            {
                var currentUser = GetCurrentUser();
                var medicines = await _context.Medicines.Where(m => m.Status == "active").ToListAsync();
                if(medicines != null)
                {
                    return Ok( new { medicines, currentUser.Name, currentUser.Role });
                }
                return NotFound(new { error = "medicines not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("medicines/{id}")]
        [Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetMedicineById([FromRoute] int id)
        {
            try
            {
                var medicine = await _context.Medicines.FirstOrDefaultAsync(m => m.Id == id);
                if(medicine != null)
                {
                    return Ok(medicine);
                }
                return NotFound(new { error = "medicine not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPost("cart")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> AddToCart([FromBody] Cart cart)
        {
            try
            {
                _context.Carts.Add(cart);
                var result = await _context.SaveChangesAsync();
                if(result == 1)
                {
                    return Ok(new { message = "item added to cart" });
                }
                return BadRequest(new { error = "item cannot be added" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("cart/increase/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> IncreaseQuantity([FromRoute] int id)
        {
            try
            {
                var cartToEdit = await _context.Carts.FirstOrDefaultAsync(c => c.Id == id);
                if(cartToEdit != null)
                {
                    var med = await _context.Medicines.FirstOrDefaultAsync(m => m.Id == cartToEdit.MedicineId);
                    if(med != null){
                    var available = med.AvailableQty;
                    if(cartToEdit.Quantity < available)
                    {
                        cartToEdit.Quantity = cartToEdit.Quantity + 1;
                        cartToEdit.Total = cartToEdit.UnitPrice * cartToEdit.Quantity * (1 - cartToEdit.Discount);
                        var result = await _context.SaveChangesAsync();
                        if(result == 1){
                            return Ok(new { message = "quantity icreased by 1" });
                        }
                        return BadRequest(new { error = "something went wrong" });
                    }
                    return BadRequest(new { error = "reached maximum quantity" });
                    }
                    return NotFound(new { error = "medicine not found" });
                }
                return NotFound(new { error = "cart not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("cart/decrease/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> DecreaseQuantity([FromRoute] int id)
        {
            try
            {
                var cartToEdit = await _context.Carts.FirstOrDefaultAsync(c => c.Id == id);
                if(cartToEdit != null)
                {
                    while(cartToEdit.Quantity > 1){
                        cartToEdit.Quantity = cartToEdit.Quantity - 1;
                        cartToEdit.Total = cartToEdit.UnitPrice * cartToEdit.Quantity * (1 - cartToEdit.Discount);
                        var result = await _context.SaveChangesAsync();
                        if(result == 1){
                            return Ok(new { message = "quantity decreased by 1" });
                        }
                        return BadRequest(new { error = "something went wrong" });
                    }
                    return BadRequest(new { error = "reached minimum quantity" });
                }
                return NotFound(new { error = "cart not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("cart/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> GetCartById([FromRoute] int id)
        {
            try
            {
                var query = from cart in _context.Carts
                join medicine in _context.Medicines on cart.MedicineId equals medicine.Id
                where cart.Id == id
                select new
                {
                    cart.Id,
                    cart.UserId,
                    cart.MedicineId,
                    medicine.Name,
                    medicine.Manufacturer,
                    medicine.ExpDate,
                    medicine.Image,
                    cart.UnitPrice,
                    cart.Discount,
                    cart.Quantity,
                    cart.Total
                };

                var result = await query.ToListAsync();
                if(result != null)
                {
                    return Ok(result);
                }
                return NotFound(new { error = "cart not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpDelete("cart/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> DeleteFromCart([FromRoute] int id)
        {
            try
            {
                var cart = await _context.Carts.FirstOrDefaultAsync(c => c.Id == id);
                if(cart != null)
                {
                    var result = _context.Carts.Remove(cart);
                    await _context.SaveChangesAsync();
                    return Ok(result);
                }
                return NotFound(new { error = "cart not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        public static string GenerateOrderNumber()
        {
            DateTime currentDate = DateTime.Now;

            string yearPart = (currentDate.Year % 100).ToString("D2");
            string monthPart = currentDate.Month.ToString("D2");
            string dayPart = currentDate.Day.ToString("D2");

            string orderNumber = yearPart + monthPart + dayPart + "-";

            return orderNumber;
        }

        [HttpPost("order")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> PlaceOrder([FromBody] Order order)
        {
            try
            {
                var userId = order.UserId;
                var newOrderNo = GenerateOrderNumber();
                order.OrderNo = newOrderNo;
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                var orderToEdit = await _context.Orders.FirstOrDefaultAsync(o => o.OrderNo == newOrderNo && o.UserId == order.UserId);
                if(orderToEdit != null)
                {
                    var oId = orderToEdit.Id;
                    newOrderNo = $"{newOrderNo}{oId:D5}";
                    orderToEdit.OrderNo = newOrderNo;
                
                    await _context.SaveChangesAsync();

                    //take from cart and insert into order_items
                    InsertIntoOrderItems(userId, oId);

                    //send confirmation mail
                    PlaceOrderMail(oId);
                }

                return Ok(new { message = "order placed" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        private void InsertIntoOrderItems(int userId, int oId)
        {
            var cartItems = _context.Carts.Where(c => c.UserId == userId).ToList();
            var ordersToInsert = cartItems.Select(c => new OrderItem
                {
                    OrderId = oId,
                    MedicineId = c.MedicineId,
                    UnitPrice = c.UnitPrice,
                    Discount = c.Discount,
                    Quantity = c.Quantity
                }).ToList();
            _context.OrderItems.AddRange(ordersToInsert);
            _context.SaveChanges();
            
            // Delete the entries from cart
            DelFromCart(userId, oId);
        }

        private void DelFromCart(int userId, int oId)
        {
            var cartToDelete = _context.Carts.Where(c => c.UserId == userId).ToList();
            _context.Carts.RemoveRange(cartToDelete);
            _context.SaveChanges();

            // Decrease the available quantity from medicines
            DecQty(oId);
        }

        private void DecQty(int oId)
        {
            var oItems = _context.OrderItems.Where(o => o.OrderId == oId).ToList();
            foreach(var entry in oItems)
            {
                int qtyToDecrease = entry.Quantity;
                int medId = entry.MedicineId;
                var medToEdit = _context.Medicines.FirstOrDefault(m => m.Id == medId);
                if(medToEdit != null)
                {
                    medToEdit.AvailableQty -= qtyToDecrease;
                }
            }
            _context.SaveChanges();
        }

        private void PlaceOrderMail(int orderId)
        {
            var query = from oi in _context.OrderItems
                            join o in _context.Orders on oi.OrderId equals o.Id
                            join m in _context.Medicines on oi.MedicineId equals m.Id
                            join u in _context.Users on o.UserId equals u.Id
                            where o.Id == orderId
                            select new
                            {
                                o.Id, o.OrderNo,
                                UserName = u.Name, u.EmailId, u.MobNo,
                                u.Address, u.Pincode,
                                MedicineName = m.Name, m.Manufacturer,
                                oi.UnitPrice, oi.Discount, oi.Quantity, oi.Total, o.OrderTotal,
                                m.ExpDate, o.OTimestamp, o.DTimestamp, o.OrderStatus
                            };
            var result = query.ToList();

            var text = $@"Dear {result[0].UserName},

            Thank you for choosing <strong>PillPulse</strong> for your medicine needs. 
            We are pleased to confirm the receipt of your order <strong>#{result[0].OrderNo}</strong> placed on {result[0].OTimestamp.ToString("dd MMM yyyy h:mm tt")}.
            
            <strong>Order details:</strong>
            <table border='1'><tr><td><h3>Medicine</h3></td><td><h3>Quantity</h3></td><td><h3>Unit Price</h3></td><td><h3>Total</h3></td></tr>";
            foreach(var item in result)
            {
                text+=$@"<tr><td>{item.MedicineName}</td><td>{item.Quantity}</td><td>₹ {item.UnitPrice}</td><td>₹ {item.Total}</td></tr>";
            }
            text+=$@"</table>

            <strong>Delivery Address:</strong> {result[0].Address} - {result[0].Pincode}
            <strong>Delivery Date:</strong> {result[0].DTimestamp.ToString("dd MMM yyyy")}
            <strong>Total Amount:</strong> ₹ {result[0].OrderTotal}

            We will notify you once your order has been dispatched for delivery.

            If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.

            Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!

            Best regards,
            <strong>PillPulse Team</strong>";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
            email.To.Add(MailboxAddress.Parse(result[0].EmailId));
            email.Subject = "Order Confirmation - "+result[0].OrderNo;
            email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
            var res = smtp.Send(email);
            smtp.Disconnect(true);
        }

        [HttpGet("order/{id}")]
        [Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetOrderById([FromRoute] int id)
        {
            try
            {
                var query = from oi in _context.OrderItems
                            join o in _context.Orders on oi.OrderId equals o.Id
                            join m in _context.Medicines on oi.MedicineId equals m.Id
                            join u in _context.Users on o.UserId equals u.Id
                            where o.Id == id
                            select new
                            {
                                o.Id, o.OrderNo,
                                UserName = u.Name, u.EmailId, u.MobNo,
                                u.Address, u.Pincode,
                                MedicineName = m.Name, m.Manufacturer,
                                oi.UnitPrice, oi.Discount, oi.Quantity, oi.Total, o.OrderTotal,
                                m.ExpDate, o.OTimestamp, o.DTimestamp, o.OrderStatus
                            };
                var result = await query.ToListAsync();

                if(result != null)
                {
                    return Ok(result);
                }
                return NotFound(new { error = "order not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("order/{id}")]
        [Authorize(Roles = "user")]
        public async Task<ActionResult> CancelOrder([FromRoute]int id)
        {
            try
            {
                var orderToCancel = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.OrderStatus != "cancelled");
                if(orderToCancel != null)
                {
                    orderToCancel.OrderStatus = "cancelled";
                    var result = await _context.SaveChangesAsync();

                    if(result == 1)
                    {
                        //Increase the available quantity from medicines
                        IncQty(orderToCancel.Id);

                        //send order canceled mail
                        SendCancelMail(id);
                        return Ok(new { message = "order canceled" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new {error = "order not found"});
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        private void IncQty(int oId)
        {
            var oItems = _context.OrderItems.Where(o => o.OrderId == oId).ToList();
            foreach(var entry in oItems)
            {
                int qtyToIncrease = entry.Quantity;
                int medId = entry.MedicineId;
                var medToEdit = _context.Medicines.FirstOrDefault(m => m.Id == medId);
                if(medToEdit != null)
                {
                    medToEdit.AvailableQty += qtyToIncrease;
                }
            }
            _context.SaveChanges();
        }

        private void SendCancelMail(int orderId)
        {
            var query = from oi in _context.OrderItems
                        join o in _context.Orders on oi.OrderId equals o.Id
                        join m in _context.Medicines on oi.MedicineId equals m.Id
                        join u in _context.Users on o.UserId equals u.Id
                        where o.Id == orderId
                        select new
                        {
                            o.Id, o.OrderNo,
                            UserName = u.Name, u.EmailId, u.MobNo,
                            u.Address, u.Pincode,
                            MedicineName = m.Name, m.Manufacturer,
                            oi.UnitPrice, oi.Discount, oi.Quantity, oi.Total, o.OrderTotal,
                            m.ExpDate, o.OTimestamp, o.DTimestamp, o.OrderStatus
                        };
            var result = query.ToList();

            var text = $@"Dear {result[0].UserName},

            We have received your request to cancel order <strong>#{result[0].OrderNo}</strong>. We want to confirm that your order has been successfully canceled.
            
            <strong>Order details:</strong>
            <table border='1'><tr><td><h3>Medicine</h3></td><td><h3>Quantity</h3></td><td><h3>Unit Price</h3></td><td><h3>Total</h3></td></tr>";
            foreach(var item in result)
            {
                text+=$@"<tr><td>{item.MedicineName}</td><td>{item.Quantity}</td><td>₹ {item.UnitPrice}</td><td>₹ {item.Total}</td></tr>";
            }
            text+=$@"</table>

            <strong>Cancellation Date: </strong> {DateTime.Today.ToString("dd MMM yyyy")}
            <strong>Refund Amount: </strong> ₹ {result[0].OrderTotal}

            The refund amount will be processed to your original payment method within 3 working day.

            If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.

            Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!

            Best regards,
            <strong>PillPulse Team</strong>";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
            email.To.Add(MailboxAddress.Parse(result[0].EmailId));
            email.Subject = "Order Cancellation Confirmation -#"+result[0].OrderNo;
            email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
            var res = smtp.Send(email);
            smtp.Disconnect(true);
        }

        [HttpGet("orders/{id}")]
        [Authorize(Roles = "user,admin")]
        public async Task<ActionResult> GetOrdersByUserId([FromRoute] int id)
        {
            try
            {
                var query = from oi in _context.OrderItems
                            join o in _context.Orders on oi.OrderId equals o.Id
                            join m in _context.Medicines on oi.MedicineId equals m.Id
                            join u in _context.Users on o.UserId equals u.Id
                            where o.UserId == id
                            select new
                            {
                                o.Id, o.OrderNo,
                                UserName = u.Name, u.EmailId, u.MobNo,
                                u.Address, u.Pincode,
                                MedicineName = m.Name, m.Manufacturer,
                                oi.UnitPrice, oi.Discount, oi.Quantity, oi.Total, o.OrderTotal,
                                m.ExpDate, o.OTimestamp, o.DTimestamp, o.OrderStatus
                            };
                var result = await query.ToListAsync();

                if(result != null)
                {
                    return Ok(result);
                }
                return NotFound(new { error = "order not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }
    }
}
