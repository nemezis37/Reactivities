using System.Threading;
using System.Threading.Tasks;
using Application.Core;
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
            public Handler(DataContext context)
            {
                _context = context;
            }
            
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                _context.Activities.Add(request.Activity);
                var affectedRows =  await _context.SaveChangesAsync();
                var result = affectedRows > 0;
                if(!result)
                    return Result<Unit>.Error("Error creating activity");
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}