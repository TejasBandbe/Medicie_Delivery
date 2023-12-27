using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit;
using MimeKit.Text;
using PillPulse.Data;
using PillPulse.Models;

namespace PillPulseBackendDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminsController : ControllerBase
    {
        private readonly PillPulseContext _context;
        private readonly IConfiguration _config;

        public AdminsController(PillPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [HttpPost("medicine")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> AddMedicine([FromBody] Medicine medicine)
        {
            try{
                _context.Medicines.Add(medicine);
                var result = await _context.SaveChangesAsync();
                if(result == 1)
                {
                    return Ok(new { message = "medicine added", medicine });
                }
                return BadRequest(new { error = "medicine cannot be added" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("medicine/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> EditMedicine([FromRoute] int id, [FromBody] Medicine med)
        {
            try
            {
                var medToEdit = await _context.Medicines.FirstOrDefaultAsync(m => m.Id == id);
                if(medToEdit != null)
                {
                    medToEdit.Name = med.Name;
                    medToEdit.Manufacturer = med.Manufacturer;
                    medToEdit.UnitPrice = med.UnitPrice;
                    medToEdit.Discount = med.Discount;
                    medToEdit.AvailableQty = med.AvailableQty;
                    medToEdit.ExpDate = med.ExpDate;
                    medToEdit.Image = med.Image;

                    var result = await _context.SaveChangesAsync();
                    if(result == 1)
                    {
                        return Ok(new { message = "medicine updated" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new { error = "medicine not found" });

            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpDelete("medicine/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> DeleteMedicine([FromRoute] int id)
        {
            try
            {
                var medToEdit = await _context.Medicines.FirstOrDefaultAsync(m => m.Id == id);
                if(medToEdit != null)
                {
                    medToEdit.Status = "inactive";
                    var result = await _context.SaveChangesAsync();
                    if(result == 1){
                        return Ok(new { message = "medicine deleted" });
                    }
                    return BadRequest(new { error = "something went wrong" });
                }
                return NotFound(new { error = "medicine not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("users")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetAllUsers()
        {
            try
            {
                var users = await _context.Users.Where(u => u.Status == "active" && u.Role == "user").ToListAsync();
                if(users != null)
                {
                    return Ok(users);
                }
                return NotFound(new { error = "users not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("orders")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetAllOrders()
        {
            try
            {
                var query = from oi in _context.OrderItems
                            join o in _context.Orders on oi.OrderId equals o.Id
                            join m in _context.Medicines on oi.MedicineId equals m.Id
                            join u in _context.Users on o.UserId equals u.Id
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
                return NotFound(new { error = "orders not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpPut("orders/{id}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> Dispatch([FromRoute] int id)
        {
            try
            {
                var orderToUpdate = await _context.Orders.Where(o => o.Id == id && o.OrderStatus == "ordered")
                           .FirstOrDefaultAsync();
                if(orderToUpdate != null)
                {
                    orderToUpdate.OrderStatus = "dispatched";
                    var result = await _context.SaveChangesAsync();
                    if(result == 1)
                    {
                        SendDispatchMail(id);
                        return Ok(new { message = "order dispatched" });
                    }
                    return BadRequest(new { error = "order cannot be dispatched" });
                }
                return NotFound(new { error = "order not found" });
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        private void SendDispatchMail(int orderId)
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

            We are excited to inform you that your order <strong>#{result[0].OrderNo}</strong> has been dispatched and is on its way to you. 
            Below are the details of your dispatched order:

            <strong>Dispatch Date:</strong> {DateTime.Today.ToString("dd MMM yyyy")}
            <strong>Tracking Number:</strong> TRC-23-11-4590 
            
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

            We will send you regular updates on the status of your delivery.

            If you have any questions or concerns about your order, please don't hesitate to contact our customer support team at <u>medbookingpro@gmail.com</u> or <u>+91 9823629901</u>.

            Thank you again for choosing <strong>PillPulse</strong>. We appreciate your business!

            Best regards,
            <strong>PillPulse Team</strong>";

            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
            email.To.Add(MailboxAddress.Parse(result[0].EmailId));
            email.Subject = "Your Order #"+result[0].OrderNo+" has been dispatched";
            email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

            using var smtp = new SmtpClient();
            smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
            var res = smtp.Send(email);
            smtp.Disconnect(true);
        }

        [HttpGet("revenue")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetTotalRevenue()
        {
            try
            {
                var revenue = await _context.Orders.SumAsync(o => o.OrderTotal);
                return Ok(revenue);
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("revenuebyyear/{year}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetRevenueByYear([FromRoute] int year)
        {
            try
            {
                var revenue = await _context.Orders.Where(o => o.OTimestamp.Year == year)
                            .SumAsync(o => o.OrderTotal);
                return Ok(revenue);
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }

        [HttpGet("revenuebymonth/{month}")]
        [Authorize(Roles = "admin")]
        public async Task<ActionResult> GetRevenueByMonth([FromRoute] int month)
        {
            try
            {
                var revenue = await _context.Orders.Where(o => o.OTimestamp.Month == month)
                            .SumAsync(o => o.OrderTotal);
                return Ok(revenue);
            }
            catch(Exception ex)
            {
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }
    }
}
