using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using MimeKit;
using MimeKit.Text;
using PillPulse.Data;
using PillPulse.Models;
using PillPulseBackendDotNet.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace PillPulseBackendDotNet.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LoginController : ControllerBase
    {
        private readonly PillPulseContext _context;
        private IConfiguration _config;

        public LoginController(PillPulseContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult> Login([FromBody] UserLogin userLogin)
        {
            try
            {
                var user = Authenticate(userLogin);

                if (user != null)
                {
                    var token = Generate(user);
                    return Ok(new { user, token });
                }
                return NotFound("user not found");
            }
            catch(Exception ex)
            {
                return BadRequest(new { error = "login failed", ex.Message });
            }
        }

        private string Generate(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Name),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"], 
                _config["Jwt:Audience"],
                claims,
                expires: DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        private User Authenticate(UserLogin userLogin)
        {
            var currentUser = _context.Users.FirstOrDefault(u => u.EmailId.ToLower() ==
            userLogin.Email.ToLower() && u.Password == userLogin.Password && u.Status == "active");

            if(currentUser != null)
            {
                return currentUser;
            }
            return null;
        }

        private string GeneratePassword()
        {
            var UppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var LowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
            var  Numbers = "0123456789";
            var SpecialCharacters = "!@#$*?";
            var allCharacters = UppercaseLetters + LowercaseLetters + Numbers + SpecialCharacters;
            Random random = new Random();
            string password = "" +
            GetRandomCharacter(UppercaseLetters, random) + 
            GetRandomCharacter(LowercaseLetters, random) +
            GetRandomCharacter(Numbers, random) +
            GetRandomCharacter(SpecialCharacters, random);

            for (int i = password.Length; i < 8; i++)
            {
                password += GetRandomCharacter(allCharacters, random);
            }

            password = new string(password.ToCharArray().OrderBy(x => random.Next()).ToArray());
            return password;
        }

        private static char GetRandomCharacter(string characterSet, Random random)
        {
            int index = random.Next(characterSet.Length);
            return characterSet[index];
        }

        [AllowAnonymous]
        [HttpPost("forgotpass/{emailid}")]
        public async Task<ActionResult> ForgotPassword([FromRoute] string emailid)
        {
            try{
                var user = await _context.Users.FirstOrDefaultAsync(u => u.EmailId == emailid && u.Status == "active");
                if(user != null)
                {
                    var newPassword = GeneratePassword();
                    user.Password = newPassword;
                    await _context.SaveChangesAsync();

                    var text = $@"Dear user,

                    We received a request to reset your password for your PillPulse account.
                    This is your temporary password is:

                    {newPassword}
                    
                    We recommend you to login using this password and change the password by following the path:
                    Profile -> Update Password

                    Thank you,
                    PillPulse Team";

                    var email = new MimeMessage();
                    email.From.Add(MailboxAddress.Parse("medbookingpro@gmail.com"));
                    email.To.Add(MailboxAddress.Parse(emailid));
                    email.Subject = "Password reset request";
                    email.Body = new TextPart(TextFormat.Html){ Text = $"<p>{text.Replace("\n", "<br>")}</p>" };

                    using var smtp = new SmtpClient();
                    smtp.Connect("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                    smtp.Authenticate("medbookingpro@gmail.com", "bzllnhermxwxppad");
                    var result = smtp.Send(email);
                    smtp.Disconnect(true);

                    return Ok(new { message = "email sent", result });
                }
                return NotFound(new { error = "user not found" });
            }catch(Exception ex){
                return NotFound(new { error = "something went wrong", ex.Message });
            }
        }
    }
}
