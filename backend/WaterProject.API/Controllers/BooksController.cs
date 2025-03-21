using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WaterProject.API.Data;
using WaterProject.API.Models;

namespace WaterProject.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        // ✅ GET ALL BOOKS WITH PAGINATION AND SORTING
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            int page = 1, int pageSize = 5, string? sort = "Title")
        {
            var booksQuery = _context.Books.AsQueryable();

            // Sorting
            booksQuery = sort switch
            {
                "Title" => booksQuery.OrderBy(b => b.Title),
                "Author" => booksQuery.OrderBy(b => b.Author),
                _ => booksQuery
            };

            // Pagination
            var books = await booksQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(books);
        }
    }
}
