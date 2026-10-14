using System;

namespace API.DTOs;

public class UserManagementDto
{
    public required string Id { get; set; }
    public required string Email {get; set;}
    
    public List<string> Roles {get; set;} = [];
}
