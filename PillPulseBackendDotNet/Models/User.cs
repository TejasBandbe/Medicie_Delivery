using System;
using System.Collections.Generic;

namespace PillPulse.Models;

public partial class User
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int Age { get; set; }

    public string EmailId { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string MobNo { get; set; } = null!;

    public string Address { get; set; } = null!;

    public string Pincode { get; set; } = null!;

    public string? Role { get; set; } = null!;

    public DateTime RegisteredOn { get; set; }

    public string? Status { get; set; } = null!;

    public string? X { get; set; }

    public string? Y { get; set; }

    public virtual ICollection<Cart> Carts { get; set; } = new List<Cart>();

    public virtual ICollection<Order> Orders { get; set; } = new List<Order>();
}
