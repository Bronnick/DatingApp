using System;
using API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace API.Data;

public class AppDbContext(DbContextOptions options) : IdentityDbContext<AppUser>(options)
{
    public DbSet<Member> Members {get; set;}

    public DbSet<Photo> Photos{get;set;}

    public DbSet<MemberLike> Likes{get; set;}

    public DbSet<Message> Messages {get; set;}

    public DbSet<Group> Groups {get; set;}
    public DbSet<Connection> Connections {get; set;}

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<IdentityRole>()
            .HasData(
                new IdentityRole{Id = "member-id", Name = "Member", NormalizedName="MEMBER", ConcurrencyStamp="member-concurrency-stamp"},
                new IdentityRole{Id = "moderator-id", Name = "Moderator", NormalizedName="MODERATOR", ConcurrencyStamp="moderator-concurrency-stamp"},
                new IdentityRole{Id = "admin-id", Name = "Admin", NormalizedName="ADMIN", ConcurrencyStamp="admin-concurrency-stamp"}
            ); 

        modelBuilder.Entity<MemberLike>()
            .HasKey(like => new{like.SourceMemberId, like.TargetMemberId});

        modelBuilder.Entity<MemberLike>()
            .HasOne(s => s.SourceMember)
            .WithMany(t => t.LikedMembers)
            .HasForeignKey(s => s.SourceMemberId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<MemberLike>()
            .HasOne(s => s.TargetMember)
            .WithMany(t => t.LikedByMembers)
            .HasForeignKey(s => s.TargetMemberId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(s => s.Sender)
            .WithMany(t => t.MessagesSent)
            .HasForeignKey(s => s.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Message>()
            .HasOne(s => s.Recipient)
            .WithMany(t => t.MessagesReceived)
            .HasForeignKey(s => s.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);

        var dateTimeConverter = new ValueConverter<DateTime, DateTime>(
            v => v.ToUniversalTime(),
            v => DateTime.SpecifyKind(v, DateTimeKind.Utc)
        );

        var nullableDateTimeConverter = new ValueConverter<DateTime?, DateTime?>(
            v => v.HasValue ? v.Value.ToUniversalTime() : null,
            v => v.HasValue ? DateTime.SpecifyKind(v.Value, DateTimeKind.Utc) : null
        );

        foreach(var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach(var property in entityType.GetProperties())
            {
                if(property.ClrType == typeof(DateTime))
                {
                    property.SetValueConverter(dateTimeConverter);
                } else if(property.ClrType == typeof(DateTime?))
                {
                    property.SetValueConverter(nullableDateTimeConverter);
                }
             }
        }
    }
}
