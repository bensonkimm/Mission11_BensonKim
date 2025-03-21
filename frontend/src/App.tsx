import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  isbn: string;
  category: string;
  pageCount: number;
  price: number;
}

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("Title");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        console.log(
          `Fetching books from: https://localhost:7135/api/books?page=${currentPage}&pageSize=${pageSize}&sort=${sortBy}`
        );

        const response = await axios.get("https://localhost:7135/api/books", {
          params: { page: currentPage, pageSize, sort: sortBy },
        });

        if (response.status === 200) {
          setBooks(response.data);
          setError(null);
        } else {
          setError("No books available.");
        }
      } catch (error) {
        console.error("Error fetching books:", error);
        setError("Failed to fetch books. Please check your backend.");
      }
    };

    fetchBooks();
  }, [currentPage, pageSize, sortBy]);

  return (
    <div className="container mt-4">
      <h1 className="text-center">📚 Online Bookstore</h1>

      {/* Sorting Options */}
      <div className="mb-3">
        <label>Sort by: </label>
        <select
          className="form-select w-auto d-inline-block ms-2"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="Title">Title</option>
          <option value="Author">Author</option>
        </select>
      </div>

      {/* Books Table */}
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Publisher</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Pages</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {error ? (
            <tr>
              <td colSpan={7} className="text-center text-danger">
                {error}
              </td>
            </tr>
          ) : books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center text-danger">
                No books available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="d-flex justify-content-between align-items-center">
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          ◀ Prev
        </button>
        <span>Page {currentPage}</span>
        <button className="btn btn-primary" onClick={() => setCurrentPage((p) => p + 1)}>
          Next ▶
        </button>

        {/* Page Size Selection */}
        <div>
          <label>Results per page: </label>
          <select
            className="form-select w-auto d-inline-block ms-2"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default App;
