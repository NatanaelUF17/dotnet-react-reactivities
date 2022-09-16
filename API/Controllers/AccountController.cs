using System.Security.Claims;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;

namespace API.Controllers
{
    [AllowAnonymous]
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _singInManager;
        private readonly TokenService _tokenService;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> singInManager,
            TokenService tokenService, IConfiguration configuration)
        {
            _userManager = userManager;
            _singInManager = singInManager;
            _tokenService = tokenService;
            _configuration = configuration;
            _httpClient = new HttpClient()
            {
                BaseAddress = new Uri("https://graph.facebook.com")
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == loginDTO.Email);

            if (user == null) return Unauthorized();

            var result = await _singInManager.CheckPasswordSignInAsync(user, loginDTO.Password, false);

            if (result.Succeeded)
            {
                return createUserObject(user);
            }

            return Unauthorized();
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == registerDTO.Email))
            {
                ModelState.AddModelError("email", "Email taken");
                return ValidationProblem();
            }

            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDTO.Username))
            {
                ModelState.AddModelError("username", "Username taken");
                return ValidationProblem();
            }

            var user = new AppUser
            {
                DisplayName = registerDTO.DisplayName,
                Email = registerDTO.Email,
                UserName = registerDTO.Username,
            };

            var result = await _userManager.CreateAsync(user, registerDTO.Password);

            if (result.Succeeded)
            {
                return createUserObject(user);
            }

            return BadRequest("Problem registering user");
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDTO>> GetCurrentUser()
        {
            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            return createUserObject(user);
        }

        [HttpPost("facebookLogin")]
        public async Task<ActionResult<UserDTO>> FacebookLogin(string accessToken)
        {
            var facebookVerifyKeys = _configuration["Facebook:AppId"] + "|" + _configuration["Facebook:AppSecret"];
            
            var verifyToken = await _httpClient
                .GetAsync($"debug_token?input_token={accessToken}&access_token={facebookVerifyKeys}");
        
            if (!verifyToken.IsSuccessStatusCode) return Unauthorized();

            var facebookUrl = $"me?access_token={accessToken}&fields=name,email,picture.width(100).height(100)";
        
            var response = await _httpClient.GetAsync(facebookUrl);

            if (!response.IsSuccessStatusCode) return Unauthorized();

            var facebookInfo = JsonConvert.DeserializeObject<dynamic>(await response.Content.ReadAsStringAsync());

            var username = (string)facebookInfo.Id;

            var user = await _userManager.Users.Include(p => p.Photos)
                .FirstOrDefaultAsync(x => x.UserName == username);

            if (user != null) return createUserObject(user);

            user = new AppUser
            {
                DisplayName = (string)facebookInfo.name,
                Email = (string)facebookInfo.email,
                UserName = (string)facebookInfo.id,
                Photos = new List<Photo>
                {
                    new Photo 
                    { 
                        Id = "fb_" + (string)facebookInfo.id, 
                        Url = (string)facebookInfo.picture.data.url,
                        IsMain = true,
                    } 
                }
            };

            var result = await _userManager.CreateAsync(user);

            if (!result.Succeeded) return BadRequest("Problem creating user account");

            return createUserObject(user);
        }

        private UserDTO createUserObject(AppUser user)
        {
            return new UserDTO
            {
                DisplayName = user.DisplayName,
                Image = user?.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
                Token = _tokenService.GenerateToken(user),
                Username = user.UserName,
            };
        }
    }
}