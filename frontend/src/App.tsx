import { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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

interface CartItem extends Book {
  quantity: number;
}

const App = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortBy, setSortBy] = useState("Title");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get("https://localhost:7135/api/books", {
        params: {
          page: currentPage,
          pageSize,
          sort: sortBy,
          ...(category && { category }), // only adds category if not empty
        },
      })
      .then((res) => {
        setBooks(res.data);
        setError("");
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch books. Please check your backend.");
      });
  }, [currentPage, pageSize, sortBy, category]);

  useEffect(() => {
    setCategories([
      "Classic",
      "Biography",
      "Historical",
      "Self-Help",
      "Business",
      "Thrillers",
      "Christian Books",
      "Health",
      "Action",
    ]);
  }, []);
  

  const addToCart = (book: Book) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) =>
          item.title === book.title &&
          item.author === book.author &&
          item.price === book.price
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex] = {
          ...updatedCart[existingIndex],
          quantity: updatedCart[existingIndex].quantity + 1,
        };
        return updatedCart;
      } else {
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mt-4">
      <h1 className="text-center">
        📚 Benson's Online Bookstore <span className="badge bg-info">{books.length} Books</span>
      </h1>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label>Sort by: </label>
          <select
            className="form-select w-auto d-inline-block ms-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="Title">Title</option>
            <option value="Author">Author</option>
          </select>

          <label className="ms-4">Filter by category: </label>
          <select
            className="form-select w-auto d-inline-block ms-2"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCurrentPage(1); // go to page 1 when category changes
            }}
          >
            <option value="">All</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            <th>Add</th>
          </tr>
        </thead>
        <tbody>
          {books.length > 0 ? (
            books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.author}</td>
                <td>{book.publisher}</td>
                <td>{book.isbn}</td>
                <td>{book.category}</td>
                <td>{book.pageCount}</td>
                <td>${book.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => addToCart(book)}
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center text-danger">
                {error || "No books available"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

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

      <div className="mt-4">
        <h4>🛒 Cart Summary</h4>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="list-group">
            {cart.map((item) => (
              <li className="list-group-item d-flex justify-content-between align-items-center" key={item.id}>
                <div>
                  <strong>{item.title}</strong>
                  <div className="text-muted small">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="fw-semibold">${(item.quantity * item.price).toFixed(2)}</div>
              </li>
            ))}
            <li className="list-group-item d-flex justify-content-between fw-bold">
              <div>Total</div>
              <div>${total.toFixed(2)}</div>
            </li>
          </ul>
        )}
      </div>

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div
          id="liveToast"
          className="toast show text-bg-primary"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div className="toast-header">
            <strong className="me-auto">Welcome</strong>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="toast"
              aria-label="Close"
            ></button>
          </div>
          <div className="toast-body">Happy shopping at our bookstore!</div>
        </div>
      </div>
    </div>
  );
};

export default App;
