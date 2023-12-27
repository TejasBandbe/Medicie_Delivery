using System;
using System.Collections.Generic;

namespace PillPulse.Models;

public partial class Cart
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public int MedicineId { get; set; }

    public float UnitPrice { get; set; }

    public float Discount { get; set; }

    public int Quantity { get; set; }

    public float Total { get; set; }

    public string? X { get; set; }

    public string? Y { get; set; }

    public virtual Medicine? Medicine { get; set; } = null!;

    public virtual User? User { get; set; } = null!;
}
