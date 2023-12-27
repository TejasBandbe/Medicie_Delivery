using System;
using System.Collections.Generic;

namespace PillPulse.Models;

public partial class Order
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string? OrderNo { get; set; } = null!;

    public float OrderTotal { get; set; }

    public DateTime OTimestamp { get; set; }

    public DateTime DTimestamp { get; set; }

    public string? OrderStatus { get; set; } = null!;

    public string? X { get; set; }

    public string? Y { get; set; }

    public virtual ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();

    public virtual User? User { get; set; } = null!;
}
