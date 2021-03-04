using System.Linq;
using Application.Activities;
using Application.Comments;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Activity, Activity>();
            
            CreateMap<Activity, ActivityDto>()
                .ForMember(a => a.HostUserName, o => o.MapFrom(s => s.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));
            
            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(p => p.DisplayName, o => o.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, o => o.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.Bio, o => o.MapFrom(aa => aa.AppUser.Bio))
                .ForMember(d => d.Image, o => o.MapFrom(s => s.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, Profiles.Profile>()
                .ForMember(d => d.Image, o => o.MapFrom(s => s.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<Comment, CommentDto>()
                .ForMember(commentDto => commentDto.DisplayName, o => o.MapFrom(comment => comment.Author.DisplayName))
                .ForMember(commentDto => commentDto.UserName, o => o.MapFrom(comment => comment.Author.UserName))
                .ForMember(commentDto => commentDto.Image, o => o.MapFrom(comment => comment.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}