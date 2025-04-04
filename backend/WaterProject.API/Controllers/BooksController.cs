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

        // ✅ GET ALL BOOKS WITH PAGINATION, SORTING, FILTERING
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
            int page = 1, int pageSize = 5, string? sort = "Title", string? category = null)
        {
            var booksQuery = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                booksQuery = booksQuery.Where(b => b.Category == category);
            }

            booksQuery = sort switch
            {
                "Title" => booksQuery.OrderBy(b => b.Title),
                "Author" => booksQuery.OrderBy(b => b.Author),
                _ => booksQuery
            };

            var books = await booksQuery
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return Ok(books);
        }

        // ✅ ADD A BOOK
        [HttpPost]
        public async Task<ActionResult<Book>> AddBook([FromBody] Book newBook)
        {
            if (newBook == null)
            {
                return BadRequest("Book data is missing.");
            }

            _context.Books.Add(newBook);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBooks), new { }, newBook);
        }

        // ✅ UPDATE A BOOK
        [HttpPut]
        public async Task<IActionResult> UpdateBook([FromBody] Book updatedBook)
        {
            if (updatedBook == null)
            {
                return BadRequest("Book data is missing.");
            }

            var existingBook = await _context.Books.FirstOrDefaultAsync(b =>
                b.Title.ToLower() == updatedBook.Title.ToLower() &&
                b.Author.ToLower() == updatedBook.Author.ToLower());

            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }

            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE A BOOK
        [HttpDelete]
        public async Task<IActionResult> DeleteBook([FromBody] Book bookToDelete)
        {
            if (bookToDelete == null)
            {
                return BadRequest("Book data is missing.");
            }

            var existingBook = await _context.Books.FirstOrDefaultAsync(b =>
                b.Title.ToLower() == bookToDelete.Title.ToLower() &&
                b.Author.ToLower() == bookToDelete.Author.ToLower());

            if (existingBook == null)
            {
                return NotFound("Book not found.");
            }

            _context.Books.Remove(existingBook);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
