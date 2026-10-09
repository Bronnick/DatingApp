using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class LikesRepository(AppDbContext context) : ILikesRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public async void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(member => member.SourceMemberId == memberId)
            .Select(member => member.TargetMemberId)
            .ToListAsync();
            //.SelectMany(member => member.LikedMembers)
            //.Select(memberLike => memberLike.TargetMemberId);


        // if(member != null) {
        //     return member.LikedMembers.Select(member => member.TargetMemberId).ToList();
        // }

        // return [];
    }

    public async Task<MemberLike?> GetMemberLike(string SourceMemberId, string TargetMemberId)
    {
        return await context.Likes.FindAsync(SourceMemberId, TargetMemberId);
    }

    public async Task<IReadOnlyList<Member>> GetMemberLikes(string predicate, string memberId)
    {
        var query = context.Likes.AsQueryable();

        switch(predicate)
        {
            case "liked":
                return await query
                    .Where(like => like.SourceMemberId == memberId)
                    .Select(like => like.TargetMember)
                    .ToListAsync();
                
            case "likedBy":
                return await query
                    .Where(like => like.TargetMemberId == memberId)
                    .Select(like => like.SourceMember)
                    .ToListAsync();
            default:
                var likeIds = await GetCurrentMemberLikeIds(memberId);
                return await query
                    .Where(like => like.TargetMemberId == memberId && likeIds.Contains(like.SourceMemberId))
                    .Select(like => like.SourceMember)
                    .ToListAsync();
                
        }
    }

    public async Task<bool> SaveAllChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
