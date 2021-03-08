using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<PagedList<ActivityDto>>>
        {
            public ActivityParams Params { get; set; }

        }

        public class Handler : IRequestHandler<Query, Result<PagedList<ActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                _context = context;
                _mapper = mapper;
                _userAccessor = userAccessor;
            }

            public async Task<Result<PagedList<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var activitiesDto = _context
                    .Activities
                    .Where(x => x.Date >= request.Params.StartDate)
                    .OrderBy(x => x.Date)
                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider, new {currentUserName = _userAccessor.GetUserName()})
                    .AsQueryable();

                if (request.Params.IsGoing && !request.Params.IsHost)
                    activitiesDto =
                        activitiesDto.Where(x => x.Attendees.Any(a => a.UserName == _userAccessor.GetUserName()));
                if (request.Params.IsHost && !request.Params.IsGoing)
                    activitiesDto = activitiesDto.Where(x => x.HostUserName == _userAccessor.GetUserName());
                var pagedList = await PagedList<ActivityDto>.CreateAsync(activitiesDto, request.Params.PageNumber, request.Params.PageSize);
                return Result<PagedList<ActivityDto>>.Success(pagedList);
            }
        }
    }
}