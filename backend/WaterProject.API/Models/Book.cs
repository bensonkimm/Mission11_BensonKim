using System.ComponentModel.DataAnnotations;

namespace WaterProject.API.Models
{
    public class Book
    {
        [Key]
        public int BookID { get; set; }


        public string Title { get; set; }
        public string Author { get; set; }
        public string Publisher { get; set; }
        public string ISBN { get; set; }
        public string Category { get; set; }
        public int PageCount { get; set; }
        public decimal Price { get; set; }
    }
}
