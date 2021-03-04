using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Edit
    {
        public class Command: IRequest<Result<Unit>>
        {
            public string DisplayName{get;set;}

            public string Bio { get; set; }
        }

        public class CommandValidator: AbstractValidator<Profile>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
            }
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
                var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUserName(),
                    cancellationToken);
                if (user == null)
                    return null;

                user.DisplayName = request.DisplayName;
                user.Bio = request.Bio;

                var affectedRows = await _dataContext.SaveChangesAsync(cancellationToken);
                return affectedRows > 0
                    ? Result<Unit>.Success(Unit.Value)
                    : Result<Unit>.Error("Error updating user details");
            }
        }
    }
}
