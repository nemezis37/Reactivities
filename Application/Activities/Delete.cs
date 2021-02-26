using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            public Handler(DataContext dataContext)
            {
                _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Id);
                if (activity == null)
                    return null;
                _dataContext.Activities.Remove(activity);
                var affectedRows = await _dataContext.SaveChangesAsync();
                if(affectedRows > 0)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Error("Failed to delete activity");
            }
        }
    }
}