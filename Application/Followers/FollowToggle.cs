using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IUserAccessor _userAccessor;

            public Handler(DataContext dataContext, IUserAccessor userAccessor)
            {
                _dataContext = dataContext;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var observer =
                    await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(),
                        cancellationToken);

                var target = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == request.TargetUserName,
                    cancellationToken);

                if (target == null)
                    return null;

                var following = await _dataContext.UserFollowings.FindAsync(observer.Id, target.Id);
                if (following == null)
                {
                    following = new UserFollowing {Observer = observer, Target = target};
                    _dataContext.UserFollowings.Add(following);
                }
                else
                {
                    _dataContext.UserFollowings.Remove(following);
                }

                var affectedRows = await _dataContext.SaveChangesAsync(cancellationToken);
                return affectedRows > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Error("Error updating following");

            }
        }
    }
}
