export interface Book {
    id?: number; // Optional in case it's generated server-side
    title: string;
    author: string;
    publisher: string;
    isbn: string;
    category: string;
    pageCount: number;
    price: number;
}