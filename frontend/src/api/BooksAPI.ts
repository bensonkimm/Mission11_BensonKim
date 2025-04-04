import { Book } from "../types/book"; 

interface FetchBooksResponse {
    items: Book[];
    totalItems: number;
}

const API_URL = "https://waterproject-kim-backend-bpg0bcb2dgayfpam.eastus-01.azurewebsites.net/api/books";

export const fetchBooks = async (
    page: number,
    pageSize: number,
    categories: string[]
): Promise<FetchBooksResponse> => {
    try {
        const queryParams = new URLSearchParams({
            page: page.toString(),
            pageSize: pageSize.toString(),
        });

        categories.forEach((cat) => {
            queryParams.append("category", cat);
        });

        const response = await fetch(`${API_URL}?${queryParams}`);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();

        return {
            items: data.books || [],
            totalItems: data.totalBooks || 0
        };
    } catch (error) {
        console.error("Failed to fetch books:", error);
        return {
            items: [],
            totalItems: 0
        };
    }
};
