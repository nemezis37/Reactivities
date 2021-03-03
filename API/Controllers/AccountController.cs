using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTO;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly TokenService _tokenService;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager,
            TokenService tokenService)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> LogIn(LoginDTO loginDTO)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDTO.Email);
            if (user == null)
                return Unauthorized();
            var signInResult = await _signInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);
            if (!signInResult.Succeeded)
                return Unauthorized();
            return ToUserDTO(user);
        }

        private UserDTO ToUserDTO(AppUser user)
        {
            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
                UserName = user.UserName,
                Token = _tokenService.CreteToken(user)
            };
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            var emailTaken = await _userManager.Users.AnyAsync(x => x.Email == registerDTO.Email);
            if (emailTaken)
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            var userNameTaken = await _userManager.Users.AnyAsync(x => x.UserName == registerDTO.UserName);
            if (userNameTaken)
            {
                ModelState.AddModelError("userName", "User name taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                UserName = registerDTO.UserName,
                Email = registerDTO.Email,
                DisplayName = registerDTO.DisplayName
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);
            if (result.Succeeded)
                return ToUserDTO(user);
            return BadRequest("Error creating user");
        }

        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(x => x.Photos)
                    .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));
            return ToUserDTO(user);
        }
    }
}
