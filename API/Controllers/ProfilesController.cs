using System.Threading.Tasks;
using API.DTO;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController:BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query {UserName = userName}));
        }

        [HttpPut]
        public async Task<IActionResult> UpdateProfileDetails(ProfileDetailsDTO detailsDTO)
        {
            var editCommand = new Edit.Command
            {
                Bio = detailsDTO.Bio, 
                DisplayName = detailsDTO.DisplayName
            };
            return HandleResult(await Mediator.Send(editCommand));
        }
    }
}
    