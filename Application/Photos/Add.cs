using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            private readonly DataContext _context;

            public Handler(DataContext context, IPhotoAccessor photoAccessor
            , IUserAccessor userAccessor)
            {
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(u => u.Photos)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName());
                if (user == null)
                    return null;
                var photoUploadResult = await _photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Url = photoUploadResult.Url,
                    Id = photoUploadResult.PublicId
                };
                if (!user.Photos.Any(x => x.IsMain))
                    photo.IsMain = true;
                user.Photos.Add(photo);
                var affectedRowsCount = await _context.SaveChangesAsync(cancellationToken);
                return affectedRowsCount > 0
                    ? Result<Photo>.Success(photo)
                    : Result<Photo>.Error("Error uploading photo");
            }
        }
    }
}
