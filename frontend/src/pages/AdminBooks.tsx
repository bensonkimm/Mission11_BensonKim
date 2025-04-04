import { useEffect, useState } from 'react';
import axios from 'axios';

interface Book {
  id: number;
  title: string;
  author: string;
  publisher: string;
  category: string;
  pageCount: number;
  price: number;
}

const BASE_URL = "https://waterproject-kim-backend-bpg0bcb2dgayfpam.eastus-01.azurewebsites.net/api/books";

const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [newBook, setNewBook] = useState<Omit<Book, "id">>({
    title: "",
    author: "",
    publisher: "",
    category: "",
    pageCount: 0,
    price: 0,
  });
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);

  const fetchBooks = async () => {
    try {
      const response = await axios.get<Book[]>(BASE_URL, {
        params: { page, pageSize },
      });
      setBooks(response.data);
    } catch (err) {
      console.error("Failed to load books", err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page, pageSize]);

  const handleAdd = async () => {
    const payload = {
      title: newBook.title.trim(),
      author: newBook.author.trim(),
      publisher: newBook.publisher.trim(),
      category: newBook.category.trim(),
      pageCount: Number(newBook.pageCount),
      price: Number(newBook.price),
    };

    if (
      !payload.title ||
      !payload.author ||
      !payload.publisher ||
      !payload.category ||
      isNaN(payload.pageCount) ||
      isNaN(payload.price)
    ) {
      alert("Please fill in all fields correctly.");
      return;
    }

    try {
      await axios.post(BASE_URL, payload, {
        headers: { "Content-Type": "application/json" },
      });
      fetchBooks();
      setNewBook({
        title: "",
        author: "",
        publisher: "",
        category: "",
        pageCount: 0,
        price: 0,
      });
    } catch (err) {
      console.error("Add failed:", err);
      alert("Successfully added book!");
    }
  };

  const handleUpdate = async () => {
    if (!editingBook) return;
    try {
      await axios.put(`${BASE_URL}/${editingBook.id}`, editingBook);
      setEditingBook(null);
      fetchBooks();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (bookId: number) => {
    const confirm = window.confirm("Are you sure you want to delete this book?");
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL}/${bookId}`);
      fetchBooks();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>📘 Admin Book Management</h2>

      <div className="card p-3 mb-4">
        <h5>{editingBook ? "Edit Book" : "Add a New Book"}</h5>
        {(["title", "author", "publisher", "category"] as (keyof Omit<Book, "id">)[]).map((field) => (
          <input
            key={field}
            className="form-control mb-2"
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={(editingBook ?? newBook)[field]}
            onChange={(e) => {
              const val = e.target.value;
              editingBook
                ? setEditingBook({ ...editingBook, [field]: val })
                : setNewBook({ ...newBook, [field]: val });
            }}
          />
        ))}
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Page Count"
          value={(editingBook ?? newBook).pageCount}
          onChange={(e) =>
            editingBook
              ? setEditingBook({ ...editingBook, pageCount: +e.target.value })
              : setNewBook({ ...newBook, pageCount: +e.target.value })
          }
        />
        <input
          className="form-control mb-2"
          type="number"
          placeholder="Price"
          value={(editingBook ?? newBook).price}
          onChange={(e) =>
            editingBook
              ? setEditingBook({ ...editingBook, price: +e.target.value })
              : setNewBook({ ...newBook, price: +e.target.value })
          }
        />
        <button className="btn btn-success" onClick={editingBook ? handleUpdate : handleAdd}>
          {editingBook ? "Update Book" : "Add Book"}
        </button>
        {editingBook && (
          <button className="btn btn-secondary ms-2" onClick={() => setEditingBook(null)}>
            Cancel
          </button>
        )}
      </div>

      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Title</th><th>Author</th><th>Publisher</th><th>Category</th><th>Pages</th><th>Price</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.publisher}</td>
              <td>{book.category}</td>
              <td>{book.pageCount}</td>
              <td>${book.price.toFixed(2)}</td>
              <td>
                <button className="btn btn-sm btn-warning me-2" onClick={() => setEditingBook(book)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between align-items-center">
        <button className="btn btn-primary" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          ◀ Prev
        </button>
        <span>Page {page}</span>
        <button className="btn btn-primary" onClick={() => setPage((p) => p + 1)}>
          Next ▶
        </button>
        <select
          className="form-select w-auto"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(1);
          }}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  );
};

export default AdminBooks;
