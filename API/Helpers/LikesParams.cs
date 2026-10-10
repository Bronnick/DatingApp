using System;

namespace API.Helpers;

public class LikesParams : PagingParams
{
    public string? predicate {get; set;} = "Mutual";
    public string? SourceMemberId { get; set; }
    public string? TargetMemberId { get; set; }
}
