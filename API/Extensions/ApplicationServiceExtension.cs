using Application.Activities;
using Application.Core;
using Application.Interfaces;
using Infrastructure.Security;
using MediatR;
using Persistance;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration configuration)
        {
            services.AddCors(options => 
            {
                options.AddPolicy("CorsPolicy", options => 
                {
                    options.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:3000");
                });
            });

             var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data source=reactivities.db";
            services.AddSqlite<DataContext>(connectionString);

            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles));
            services.AddScoped<IUserAccessor, UserAccessor>();
       
            return services;
        }
    }
}