using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class SetMain
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler: IRequestHandler<Command, Result<Unit>>
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
                var user = await _context.Users.Include(u => u.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken);
                if (user == null)
                    return null;

                var photoToBeMain = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photoToBeMain == null)
                    return null;
                var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
                if (currentMain != null)
                    currentMain.IsMain = false;
                photoToBeMain.IsMain = true;
                var affectedRows = await _context.SaveChangesAsync(cancellationToken);
                return affectedRows > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Error("Problem setting main photo");

            }
        }
    }
}
