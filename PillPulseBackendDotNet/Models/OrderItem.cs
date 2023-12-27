using System;
using System.Collections.Generic;

namespace PillPulse.Models;

public partial class OrderItem
{
    public int Id { get; set; }

    public int OrderId { get; set; }

    public int MedicineId { get; set; }

    public float UnitPrice { get; set; }

    public float Discount { get; set; }

    public int Quantity { get; set; }

    public float Total { get; set; }

    public string? X { get; set; }

    public string? Y { get; set; }

    public virtual Order Order { get; set; } = null!;
}
