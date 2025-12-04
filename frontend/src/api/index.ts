import api from './client';

export interface Author {
  id: string;
  name: string;
  bio?: string;
  birthDate?: string;
  createdAt: string;
  updatedAt: string;
  books?: Book[];
}

export interface CreateAuthorDto {
  name: string;
  bio?: string;
  birthDate?: string;
}

export interface UpdateAuthorDto extends Partial<CreateAuthorDto> {}

export interface Book {
  id: string;
  title: string;
  isbn?: string;
  description?: string;
  publishedAt?: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  author?: Author;
  borrowedBooks?: BorrowedBook[];
}

export interface CreateBookDto {
  title: string;
  isbn?: string;
  description?: string;
  publishedAt?: string;
  authorId: string;
}

export interface UpdateBookDto extends Partial<CreateBookDto> {}

export interface FilterBooksDto {
  authorId?: string;
  borrowed?: boolean;
  search?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface BorrowedBook {
  id: string;
  bookId: string;
  userId: string;
  borrowedAt: string;
  returnedAt?: string;
  dueDate: string;
  book?: Book;
  user?: User;
}

export interface BorrowBookDto {
  bookId: string;
  userId: string;
}

export const booksApi = {
  getAll: async (filters?: FilterBooksDto): Promise<Book[]> => {
    const params = new URLSearchParams();
    if (filters?.authorId) params.append('authorId', filters.authorId);
    if (filters?.borrowed !== undefined) params.append('borrowed', String(filters.borrowed));
    if (filters?.search) params.append('search', filters.search);
    
    const response = await api.get(`/books?${params.toString()}`);
    return response.data;
  },

  getOne: async (id: string): Promise<Book> => {
    const response = await api.get(`/books/${id}`);
    return response.data;
  },

  create: async (data: CreateBookDto): Promise<Book> => {
    const response = await api.post('/books', data);
    return response.data;
  },

  update: async (id: string, data: UpdateBookDto): Promise<Book> => {
    const response = await api.patch(`/books/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/books/${id}`);
  },
};

export const authorsApi = {
  getAll: async (): Promise<Author[]> => {
    const response = await api.get('/authors');
    return response.data;
  },

  getOne: async (id: string): Promise<Author> => {
    const response = await api.get(`/authors/${id}`);
    return response.data;
  },

  create: async (data: CreateAuthorDto): Promise<Author> => {
    const response = await api.post('/authors', data);
    return response.data;
  },

  update: async (id: string, data: UpdateAuthorDto): Promise<Author> => {
    const response = await api.patch(`/authors/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/authors/${id}`);
  },
};

export const usersApi = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get('/users');
    return response.data;
  },

  getOne: async (id: string): Promise<User> => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export const borrowedBooksApi = {
  getAll: async (): Promise<BorrowedBook[]> => {
    const response = await api.get('/borrowed-books');
    return response.data;
  },

  getByUser: async (userId: string): Promise<BorrowedBook[]> => {
    const response = await api.get(`/borrowed-books/user/${userId}`);
    return response.data;
  },

  borrow: async (data: BorrowBookDto): Promise<BorrowedBook> => {
    const response = await api.post('/borrowed-books', data);
    return response.data;
  },

  return: async (id: string): Promise<BorrowedBook> => {
    const response = await api.patch(`/borrowed-books/${id}/return`);
    return response.data;
  },
};
