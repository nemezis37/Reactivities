using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _dataContext;
            private readonly IMapper _mapper;
            public Handler(DataContext dataContext, IMapper mapper)
            {
                _mapper = mapper;
                _dataContext = dataContext;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var activity = await _dataContext.Activities.FindAsync(request.Activity.Id);
                if (activity == null)
                    return null;
                _mapper.Map<Activity, Activity>(request.Activity, activity);
                var affectedRows = await _dataContext.SaveChangesAsync();
                if(affectedRows > 0)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Error("Failed to update activity");
            }
        }
    }
}