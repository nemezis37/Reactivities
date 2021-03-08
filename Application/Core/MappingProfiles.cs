using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Profiles;
using Domain;
using Profile = AutoMapper.Profile;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();
            
            CreateMap<Activity, ActivityDto>()
                .ForMember(a => a.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(p => p.DisplayName, o => o.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, o => o.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.Bio, o => o.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d =>d.FollowersCount, o => o.MapFrom(x => x.AppUser.Followers.Count))
                .ForMember(d =>d.FollowingCount, o => o.MapFrom(x => x.AppUser.Followings.Count))
                .ForMember(d => d.Following, o=> o.MapFrom(s => s.AppUser.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(d =>d.FollowersCount, o => o.MapFrom(x => x.Followers.Count))
                .ForMember(d =>d.FollowingCount, o => o.MapFrom(x => x.Followings.Count))
                .ForMember(d => d.Following, o=> o.MapFrom(s => s.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<Comment, CommentDto>()
                .ForMember(commentDto => commentDto.DisplayName, o => o.MapFrom(comment => comment.Author.DisplayName))
                .ForMember(commentDto => commentDto.UserName, o => o.MapFrom(comment => comment.Author.UserName))
                .ForMember(commentDto => commentDto.Image, o => o.MapFrom(comment => comment.Author.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<ActivityAttendee, UserActivityDto>()
                .ForMember(d => d.Id, o => o.MapFrom(s => s.Activity.Id))
                .ForMember(d => d.Date, o => o.MapFrom(s => s.Activity.Date))
                .ForMember(d => d.Title, o => o.MapFrom(s => s.Activity.Title))
                .ForMember(d => d.Category, o => o.MapFrom(s => s.Activity.Category))
                .ForMember(d => d.HostUserName, o => o.MapFrom(s => s.Activity.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
        }
    }
}