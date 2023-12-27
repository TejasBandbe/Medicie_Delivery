using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MimeKit.Text;
using PillPulse.Data;

namespace PillPulseBackendDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DeliveryController : ControllerBase
    {
        private readonly PillPulseContext _context;
        private readonly IConfiguration _config;

        public DeliveryController(PillPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpGet("orders/{id}")]
        [Authorize(Roles = "delivery")]
        public async Task<ActionResult> SendOtp([FromRoute] int id)
        {
            try
            {
                var query = from o in _context.Orders
                            join u in _context.Users on o.UserId equals u.Id
                            where o.Id == id
                            select new
                            {
                                EmailId = u.EmailId,
                                UserName = u.Name,
                                OrderNo = o.OrderNo 
                            };
                var result = await query.ToListAsync();
                Random random = new Random();
                var otp = random.Next(1000, 10000);

                var text = $@"Dear {result[0].UserName},

                We are delighted to inform you that your order <strong>#{result[0].OrderNo}</strong> is out for delivery and will be arriving shortly. 
                
                To ensure the security of your delivery and confirm that it reaches the correct recipient, we have included a One-Time Password (OTP) below.

                <strong>{otp}</strong> 

                Please be ready to provide this OTP to our delivery personnel upon receipt of your order. This additional security step ensures that your order is delivered safely into your hands.

                If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.

                Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!

                Best regards,
                <strong>PillPulse Team</strong>";

                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
                email.To.Add(MailboxAddress.Parse(result[0].EmailId));
                email.Subject = "Your Order #"+result[0].OrderNo+" has been delivered";
                email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

                using var smtp = new SmtpClient();
                smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
                var res = smtp.Send(email);
                smtp.Disconnect(true);

                return Ok(otp);
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("orders/{id}")]
        [Authorize(Roles = "delivery")]
        public async Task<ActionResult> DeliverOrder([FromRoute] int id)
        {
            try
            {
                var orderToUpdate = await _context.Orders.Where(o => o.Id == id && o.OrderStatus == "dispatched")
                           .FirstOrDefaultAsync();
                if(orderToUpdate != null)
                {
                    orderToUpdate.OrderStatus = "delivered";
                    var result = await _context.SaveChangesAsync();
                    if(result == 1)
                    {
                        SendDeliveredMail(id);
                        return Ok(new { message = "order delivered" });
                    }
                    return BadRequest(new { error = "order cannot be delivered" });
                }
                return NotFound(new { error = "order not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        private void SendDeliveredMail(int orderId)
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

            We are delighted to inform you that your order <strong>#{result[0].OrderNo}</strong> has been successfully delivered. 
            We hope you receive your items in perfect condition and that they meet your expectations.
            
            <strong>Order details:</strong>
            <table border='1'><tr><td><h3>Medicine</h3></td><td><h3>Quantity</h3></td><td><h3>Unit Price</h3></td><td><h3>Total</h3></td></tr>";
            foreach(var item in result)
            {
                text+=$@"<tr><td>{item.MedicineName}</td><td>{item.Quantity}</td><td>₹ {item.UnitPrice}</td><td>₹ {item.Total}</td></tr>";
            }
            text+=$@"</table>

            <strong>Delivered to: </strong> {result[0].UserName}
            <strong>Delivery Address: </strong> {result[0].Address} - {result[0].Pincode}
            <strong>Delivery Date: </strong> {result[0].DTimestamp.ToString("dd MMM yyyy")}
            <strong>Total Amount: </strong> ₹ {result[0].OrderTotal}

            We hope you are satisfied with your purchase.

            If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.

            Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!

            Best regards,
            <strong>PillPulse Team</strong>";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
            email.To.Add(MailboxAddress.Parse(result[0].EmailId));
            email.Subject = "Your Order #"+result[0].OrderNo+" has been delivered";
            email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
            var res = smtp.Send(email);
            smtp.Disconnect(true);
        }
    }
}
