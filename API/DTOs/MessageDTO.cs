using System;

namespace API.DTOs;

public class MessageDTO
{
    public required string Id { get; set; }
    public string? SenderId { get; set; }
    public string? SenderDisplayName { get; set; }
    public string? SenderImageUrl{get; set;}
    public string? RecipientId { get; set; }
    public string? RecipientDisplayName { get; set; }
    public string? RecipientImageUrl{get; set;}


    public required string Content { get; set; }

    public DateTime? DateRead {get; set;}

    public DateTime MessageSent{get;set;} 
}
