using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface ILikesRepository
{
    Task<MemberLike> GetMemberLike(string sourceMemberId, string TargetMemberId);

    Task<PaginatedResult<Member>> GetMemberLikes(LikesParams likesParams, string memberId);

    Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId);

    void DeleteLike(MemberLike like);

    void AddLike(MemberLike like);

    Task<bool> SaveAllChanges();
}
