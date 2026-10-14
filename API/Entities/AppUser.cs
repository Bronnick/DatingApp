using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities;

public class AppUser : IdentityUser
{
    

    public required string DisplayName {get; set;}

    

    public string? ImageUrl {get; set;}

    public string? RefreshToken { get; set; }

    public DateTime? RefreshTokenExpiry { get; set; }

    //Nav
    public Member Member { get; set; } = null!;
}
