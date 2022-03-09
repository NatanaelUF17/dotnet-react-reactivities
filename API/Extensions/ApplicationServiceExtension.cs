using Application.Activities;
using Application.Core;
using MediatR;
using Persistance;

namespace API.Extensions
{
    public static class ApplicationServiceExtension
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, 
            IConfiguration configuration)
        {
            services.AddCors(options => {
                options.AddPolicy("CorsPolicy", options => {
                    options.AllowAnyMethod()
                        .AllowAnyHeader()
                        .WithOrigins("http://localhost:3000");
                });
            });
            services.AddMediatR(typeof(List.Handler).Assembly);
            services.AddAutoMapper(typeof(MappingProfiles));

            var connectionString = configuration.GetConnectionString("DefaultConnection") ?? "Data source=reactivities.db";
            services.AddSqlite<DataContext>(connectionString);
       
            return services;
        }
    }
}