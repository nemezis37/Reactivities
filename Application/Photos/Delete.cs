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
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;

            public Handler(IPhotoAccessor photoAccessor, DataContext context, IUserAccessor userAccessor)
            {
                _photoAccessor = photoAccessor;
                _context = context;
                _userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(), cancellationToken: cancellationToken);
                var photoToDelete = user.Photos.FirstOrDefault(x => x.Id == request.Id);
                if (photoToDelete == null)
                    return null;
                if(photoToDelete.IsMain)
                    return Result<Unit>.Error("Can not delete main photo");
                var result = await _photoAccessor.DeletePhoto(request.Id);
                if(result == null)
                    return Result<Unit>.Error("Error when deleting from cloudinary");
                user.Photos.Remove(photoToDelete);
                var affectedRows = await _context.SaveChangesAsync();
                return affectedRows > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Error("Error deleting photo from db");
            }
        }
    }
}
