import type { Drama, Episode, ApiResponse } from './types';

// Use proxy to bypass CORS - requests go through Vite dev server
const BASE_URL = '/api/dramabox';

// Fetch with error handling and retry
async function fetchApi<T>(endpoint: string): Promise<T> {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Failed to fetch ${endpoint}:`, error);
        throw error;
    }
}

// Get For You / Recommendations
export async function getForYou(): Promise<ApiResponse<Drama[]>> {
    return fetchApi('/foryou');
}

// Get Trending Dramas
export async function getTrending(): Promise<ApiResponse<Drama[]>> {
    return fetchApi('/trending');
}

// Get Latest Dramas
export async function getLatest(): Promise<ApiResponse<Drama[]>> {
    return fetchApi('/latest');
}

// VIP Response type (different structure)
interface VipColumn {
    columnId: number;
    title: string;
    bookList: Drama[];
}

interface VipApiResponse {
    status: boolean;
    data: {
        columnVoList: VipColumn[];
    };
}

// Get VIP Dramas - extract from columnVoList
export async function getVip(): Promise<ApiResponse<Drama[]>> {
    try {
        const response = await fetchApi<VipApiResponse>('/vip');

        // Extract all books from all columns
        const allBooks: Drama[] = [];
        if (response.data?.columnVoList && Array.isArray(response.data.columnVoList)) {
            for (const column of response.data.columnVoList) {
                if (column.bookList && Array.isArray(column.bookList)) {
                    allBooks.push(...column.bookList);
                }
            }
        }

        // Return in standard format
        return {
            status: true,
            data: allBooks,
        };
    } catch (error) {
        console.error('Failed to fetch VIP:', error);
        return { status: false, data: [] };
    }
}

// Get Random Drama (For You Video)
export async function getRandom(): Promise<ApiResponse<Drama[]>> {
    return fetchApi('/random');
}

// Search Dramas
export async function searchDramas(query: string): Promise<ApiResponse<Drama[]>> {
    return fetchApi(`/search?query=${encodeURIComponent(query)}`);
}

// Get All Episodes
export async function getAllEpisodes(bookId: string): Promise<ApiResponse<Episode[]>> {
    return fetchApi(`/allepisode?bookId=${bookId}`);
}

// Get Indonesian Dubbed Dramas
export async function getDubIndo(classify: string = 'terpopuler', page: number = 1): Promise<ApiResponse<Drama[]>> {
    return fetchApi(`/dubindo?classify=${classify}&page=${page}`);
}

// Get Popular Search Keywords
export async function getPopularSearch(): Promise<ApiResponse<string[]>> {
    return fetchApi('/populersearch');
}
