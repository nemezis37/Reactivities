using Domain;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Persistence
{
    public class DataContext : IdentityDbContext<AppUser>
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }

        public DbSet<Activity> Activities {get;set;}
        
        public DbSet<ActivityAttendee> ActivityAttendees {get;set;}
        public DbSet<Photo> Photos { get; set; }
        public DbSet<Comment> Comments { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.Entity<ActivityAttendee>().HasKey(x => new {x.ActivityGuid, x.AppUserId});

            builder.Entity<ActivityAttendee>().HasOne(aa => aa.AppUser).WithMany(appUser => appUser.Activities)
                .HasForeignKey(aa => aa.AppUserId);
            builder.Entity<ActivityAttendee>().HasOne(aa => aa.Activity).WithMany(activity => activity.Attendees)
                .HasForeignKey(aa => aa.ActivityGuid);

            builder.Entity<Comment>()
                .HasOne(x => x.Activity)
                .WithMany(c => c.Cmments)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}