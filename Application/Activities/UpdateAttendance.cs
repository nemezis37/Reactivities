using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                var activity = await _context.Activities.Include(x => x.Attendees)
                    .ThenInclude(x => x.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);

                if (activity == null)
                    return null;

                var user = await _context.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);
                var isHost = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser.UserName == user.UserName;
                var attendance = activity.Attendees.FirstOrDefault(x => x.AppUser.UserName == user.UserName);
                var attended = attendance != null;
                if (attended && isHost)
                    activity.IsCanceled = !activity.IsCanceled;
                if (attended && !isHost)
                    activity.Attendees.Remove(attendance);
                if(!attended)
                    activity.Attendees.Add(new ActivityAttendee
                    {
                        AppUser = user,
                    });
                var rowsModified = await _context.SaveChangesAsync(cancellationToken);
                return rowsModified > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Error("Error updating attendance");
            }
        }
    }
}
