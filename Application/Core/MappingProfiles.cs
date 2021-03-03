using System.Linq;
using Application.Activities;
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
            CreateMap<ActivityAttendee, Profiles.Profile>()
                .ForMember(p => p.DisplayName, o => o.MapFrom(aa => aa.AppUser.DisplayName))
                .ForMember(p => p.UserName, o => o.MapFrom(aa => aa.AppUser.UserName))
                .ForMember(p => p.Bio, o => o.MapFrom(aa => aa.AppUser.Bio));
        }
    }
}