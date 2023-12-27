using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using PillPulse.Models;

namespace PillPulse.Data;

public partial class PillPulseContext : DbContext
{
    public PillPulseContext(DbContextOptions<PillPulseContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<Medicine> Medicines { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder
            .UseCollation("utf8mb4_0900_ai_ci")
            .HasCharSet("utf8mb4");

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("cart");

            entity.HasIndex(e => e.MedicineId, "fk_cart_medicineId");

            entity.HasIndex(e => e.UserId, "fk_cart_userId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Discount).HasColumnName("discount");
            entity.Property(e => e.MedicineId).HasColumnName("medicine_id");
            entity.Property(e => e.Quantity)
                .HasDefaultValueSql("'1'")
                .HasColumnName("quantity");
            entity.Property(e => e.Total)
                .HasDefaultValueSql("((`unit_price` * `quantity`) * (1 - `discount`))")
                .HasColumnName("total");
            entity.Property(e => e.UnitPrice).HasColumnName("unit_price");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.X)
                .HasMaxLength(10)
                .HasColumnName("x");
            entity.Property(e => e.Y)
                .HasMaxLength(10)
                .HasColumnName("y");

            entity.HasOne(d => d.Medicine).WithMany(p => p.Carts)
                .HasForeignKey(d => d.MedicineId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_cart_medicineId");

            entity.HasOne(d => d.User).WithMany(p => p.Carts)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_cart_userId");
        });

        modelBuilder.Entity<Medicine>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("medicines");

            entity.HasIndex(e => new { e.Name, e.Manufacturer }, "un_name_manu").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.AvailableQty).HasColumnName("available_qty");
            entity.Property(e => e.Discount)
                .HasDefaultValueSql("'0.05'")
                .HasColumnName("discount");
            entity.Property(e => e.ExpDate)
                .HasColumnType("datetime")
                .HasColumnName("exp_date");
            entity.Property(e => e.Image)
                .HasMaxLength(200)
                .HasColumnName("image");
            entity.Property(e => e.Manufacturer)
                .HasMaxLength(20)
                .HasColumnName("manufacturer");
            entity.Property(e => e.Name)
                .HasMaxLength(40)
                .HasColumnName("name");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .HasDefaultValueSql("_cp850\\'active\\'")
                .HasColumnName("status");
            entity.Property(e => e.UnitPrice).HasColumnName("unit_price");
            entity.Property(e => e.X)
                .HasMaxLength(10)
                .HasColumnName("x");
            entity.Property(e => e.Y)
                .HasMaxLength(10)
                .HasColumnName("y");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("orders");

            entity.HasIndex(e => e.UserId, "fk_orders_userId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.DTimestamp)
                .HasDefaultValueSql("(now() + interval 3 day)")
                .HasColumnType("datetime")
                .HasColumnName("d_timestamp");
            entity.Property(e => e.OTimestamp)
                .HasDefaultValueSql("now()")
                .HasColumnType("datetime")
                .HasColumnName("o_timestamp");
            entity.Property(e => e.OrderNo)
                .HasMaxLength(12)
                .HasColumnName("order_no");
            entity.Property(e => e.OrderStatus)
                .HasMaxLength(10)
                .HasDefaultValueSql("_cp850\\'ordered\\'")
                .HasColumnName("order_status");
            entity.Property(e => e.OrderTotal).HasColumnName("order_total");
            entity.Property(e => e.UserId).HasColumnName("user_id");
            entity.Property(e => e.X)
                .HasMaxLength(10)
                .HasColumnName("x");
            entity.Property(e => e.Y)
                .HasMaxLength(10)
                .HasColumnName("y");

            entity.HasOne(d => d.User).WithMany(p => p.Orders)
                .HasForeignKey(d => d.UserId)
                .HasConstraintName("fk_orders_userId");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("order_items");

            entity.HasIndex(e => e.OrderId, "fk_orderItmes_orderId");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Discount).HasColumnName("discount");
            entity.Property(e => e.MedicineId).HasColumnName("medicine_id");
            entity.Property(e => e.OrderId).HasColumnName("order_id");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.Total)
                .HasDefaultValueSql("((`unit_price` * `quantity`) * (1 - `discount`))")
                .HasColumnName("total");
            entity.Property(e => e.UnitPrice).HasColumnName("unit_price");
            entity.Property(e => e.X)
                .HasMaxLength(10)
                .HasColumnName("x");
            entity.Property(e => e.Y)
                .HasMaxLength(10)
                .HasColumnName("y");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .HasConstraintName("fk_orderItmes_orderId");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PRIMARY");

            entity.ToTable("users");

            entity.HasIndex(e => e.EmailId, "email_id").IsUnique();

            entity.HasIndex(e => e.MobNo, "mob_no").IsUnique();

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(200)
                .HasColumnName("address");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.EmailId)
                .HasMaxLength(40)
                .HasColumnName("email_id");
            entity.Property(e => e.MobNo)
                .HasMaxLength(10)
                .HasColumnName("mob_no");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .HasColumnName("name");
            entity.Property(e => e.Password)
                .HasMaxLength(30)
                .HasColumnName("password");
            entity.Property(e => e.Pincode)
                .HasMaxLength(6)
                .HasColumnName("pincode");
            entity.Property(e => e.RegisteredOn)
                .HasDefaultValueSql("now()")
                .HasColumnType("datetime")
                .HasColumnName("registeredOn");
            entity.Property(e => e.Role)
                .HasMaxLength(10)
                .HasDefaultValueSql("_cp850\\'user\\'")
                .HasColumnName("role");
            entity.Property(e => e.Status)
                .HasMaxLength(10)
                .HasDefaultValueSql("_cp850\\'active\\'")
                .HasColumnName("status");
            entity.Property(e => e.X)
                .HasMaxLength(10)
                .HasColumnName("x");
            entity.Property(e => e.Y)
                .HasMaxLength(10)
                .HasColumnName("y");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
