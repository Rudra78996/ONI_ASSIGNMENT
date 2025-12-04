import { useState, useEffect } from 'react';
import { booksApi, authorsApi, Book, Author } from '../api';
import { Plus, Edit2, Trash2, Search, Calendar, Loader2, LayoutGrid, List } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import { DatePicker } from '../components/ui/date-picker';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../components/ui/alert-dialog';

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [search, setSearch] = useState('');
  const [filterAuthor, setFilterAuthor] = useState('all');
  const [filterBorrowed, setFilterBorrowed] = useState<string>('all');
  const [deleteBookId, setDeleteBookId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [deleting, setDeleting] = useState(false);

  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    publishedAt: Date | undefined;
    authorId: string;
  }>({
    title: '',
    description: '',
    publishedAt: undefined,
    authorId: '',
  });

  useEffect(() => {
    fetchBooks();
    fetchAuthors();
  }, [search, filterAuthor, filterBorrowed]);

  const fetchBooks = async () => {
    try {
      const filters: any = {};
      if (search) filters.search = search;
      if (filterAuthor && filterAuthor !== 'all') filters.authorId = filterAuthor;
      if (filterBorrowed !== 'all') filters.borrowed = filterBorrowed === 'true';
      
      const data = await booksApi.getAll(filters);
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const data = await authorsApi.getAll();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.authorId) {
      alert('Please select an author');
      return;
    }

    setSubmitting(true);
    try {
      // Prepare data, removing empty optional fields
      const dataToSend = {
        title: formData.title,
        authorId: formData.authorId,
        ...(formData.description && { description: formData.description }),
        ...(formData.publishedAt && { publishedAt: formData.publishedAt.toISOString().split('T')[0] }),
      };

      if (editingBook) {
        await booksApi.update(editingBook.id, dataToSend);
      } else {
        await booksApi.create(dataToSend);
      }
      setShowModal(false);
      resetForm();
      fetchBooks();
    } catch (error: any) {
      console.error('Error saving book:', error);
      const errorMessage = error.response?.data?.message || 'Failed to save book';
      alert(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteBookId) {
      setDeleting(true);
      try {
        await booksApi.delete(deleteBookId);
        fetchBooks();
      } catch (error) {
        console.error('Error deleting book:', error);
      } finally {
        setDeleting(false);
        setDeleteBookId(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      publishedAt: undefined,
      authorId: '',
    });
    setEditingBook(null);
  };

  const openModal = (book?: Book) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        description: book.description || '',
        publishedAt: book.publishedAt ? new Date(book.publishedAt) : undefined,
        authorId: book.authorId,
      });
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  if (loading) return <div className="flex items-center justify-center py-12"><div className="text-muted-foreground">Loading...</div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Books</h1>
          <p className="text-muted-foreground">Manage your library's book collection</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-md">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('card')}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
          <Button onClick={() => openModal()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search books..."
              className="pl-9"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="author-filter">Filter by Author</Label>
          <Select value={filterAuthor} onValueChange={setFilterAuthor}>
            <SelectTrigger id="author-filter">
              <SelectValue placeholder="All Authors" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Authors</SelectItem>
              {authors.map((author) => (
                <SelectItem key={author.id} value={author.id}>
                  {author.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status-filter">Borrowed Status</Label>
          <Select value={filterBorrowed} onValueChange={setFilterBorrowed}>
            <SelectTrigger id="status-filter">
              <SelectValue placeholder="All Books" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Books</SelectItem>
              <SelectItem value="true">Borrowed</SelectItem>
              <SelectItem value="false">Available</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {books.map((book) => (
          <Card key={book.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-xl line-clamp-1">{book.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1">
                    by {book.author?.name}
                  </CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button
                    onClick={() => openModal(book)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => setDeleteBookId(book.id)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              {book.description && (
                <p className="text-sm text-muted-foreground line-clamp-3">{book.description}</p>
              )}
              {book.publishedAt && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{new Date(book.publishedAt).toLocaleDateString()}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                  book.borrowedBooks && book.borrowedBooks.length > 0
                    ? 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20'
                    : 'bg-green-50 text-green-700 ring-1 ring-inset ring-green-600/20'
                }`}
              >
                <div className={`h-1.5 w-1.5 rounded-full ${
                  book.borrowedBooks && book.borrowedBooks.length > 0 ? 'bg-red-600' : 'bg-green-600'
                }`} />
                {book.borrowedBooks && book.borrowedBooks.length > 0 ? 'Borrowed' : 'Available'}
              </span>
            </CardFooter>
          </Card>
        ))}
      </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Title
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Author
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Published Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Status
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{book.title}</td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground">
                      {book.author?.name || '-'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {book.description || '-'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground">
                      {book.publishedAt ? new Date(book.publishedAt).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      <span
                        className={`mr-1.5 h-2 w-2 rounded-full ${
                          book.borrowedBooks && book.borrowedBooks.length > 0 ? 'bg-red-600' : 'bg-green-600'
                        }`}
                      ></span>
                      {book.borrowedBooks && book.borrowedBooks.length > 0 ? 'Borrowed' : 'Available'}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => openModal(book)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setDeleteBookId(book.id)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <Card className="w-full max-w-lg">
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>{editingBook ? 'Edit Book' : 'Add New Book'}</CardTitle>
                <CardDescription>
                  {editingBook ? 'Update book information' : 'Add a new book to your library'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter book title"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="author">Author</FieldLabel>
                    <Select
                      value={formData.authorId}
                      onValueChange={(value) => setFormData({ ...formData, authorId: value })}
                      required
                    >
                      <SelectTrigger id="author">
                        <SelectValue placeholder="Select an author" />
                      </SelectTrigger>
                      <SelectContent>
                        {authors.map((author) => (
                          <SelectItem key={author.id} value={author.id}>
                            {author.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <textarea
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter book description (optional)"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="publishedAt">Published Date</FieldLabel>
                    <DatePicker
                      date={formData.publishedAt}
                      onDateChange={(date) => setFormData({ ...formData, publishedAt: date })}
                      placeholder="Select published date"
                    />
                  </Field>
                </FieldGroup>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={submitting}>
                  {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingBook ? 'Update' : 'Create'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <AlertDialog open={!!deleteBookId} onOpenChange={(open) => !deleting && !open && setDeleteBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the book.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmDelete(); }} disabled={deleting}>
              {deleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Books;
