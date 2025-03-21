using Microsoft.EntityFrameworkCore;
using WaterProject.API.Models;

namespace WaterProject.API.Data
{
    public class BookstoreContext : DbContext
    {
        public BookstoreContext(DbContextOptions<BookstoreContext> options) : base(options) { }

        public DbSet<Book> Books { get; set; } 
    }
}
