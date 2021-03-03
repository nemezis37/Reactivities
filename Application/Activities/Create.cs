using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var currentUser = _context.Users.First(x => x.UserName == _userAccessor.GetUserName());
                var activityAttendee = new ActivityAttendee
                    {AppUser = currentUser, Activity = request.Activity, IsHost = true};
                request.Activity.Attendees.Add(activityAttendee);
                _context.Activities.Add(request.Activity);
                var affectedRows = await _context.SaveChangesAsync();
                var result = affectedRows > 0;
                if (!result)
                    return Result<Unit>.Error("Error creating activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}