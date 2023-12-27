using System;
using System.Collections.Generic;

namespace PillPulse.Models;

public partial class Medicine
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Manufacturer { get; set; } = null!;

    public float UnitPrice { get; set; }

    public float Discount { get; set; }

    public int AvailableQty { get; set; }

    public DateTime ExpDate { get; set; }

    public string Image { get; set; } = null!;

    public string? Status { get; set; } = null!;

    public string? X { get; set; }

    public string? Y { get; set; }

    public virtual ICollection<Cart>? Carts { get; set; } = new List<Cart>();
}
