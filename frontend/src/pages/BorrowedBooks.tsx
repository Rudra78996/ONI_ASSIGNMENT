import { useState, useEffect } from 'react';
import { borrowedBooksApi, usersApi, booksApi, BorrowedBook, User, Book } from '../api';
import { Plus, RotateCcw, BookOpen, User as UserIcon, Calendar, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
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

const BorrowedBooks = () => {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [returnBookId, setReturnBookId] = useState<string | null>(null);
  const [returning, setReturning] = useState(false);
  const [borrowing, setBorrowing] = useState(false);
  const [formData, setFormData] = useState({
    bookId: '',
    userId: '',
  });

  useEffect(() => {
    fetchBorrowedBooks();
    fetchUsers();
    fetchBooks();
  }, []);

  const fetchBorrowedBooks = async () => {
    try {
      const data = await borrowedBooksApi.getAll();
      setBorrowedBooks(data);
    } catch (error) {
      console.error('Error fetching borrowed books:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await usersApi.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const data = await booksApi.getAll({ borrowed: false });
      setBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBorrowing(true);
    try {
      await borrowedBooksApi.borrow(formData);
      setShowModal(false);
      setFormData({ bookId: '', userId: '' });
      fetchBorrowedBooks();
      fetchBooks();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Error borrowing book');
    } finally {
      setBorrowing(false);
    }
  };

  const confirmReturn = async () => {
    if (returnBookId) {
      setReturning(true);
      try {
        await borrowedBooksApi.return(returnBookId);
        fetchBorrowedBooks();
        fetchBooks();
      } catch (error) {
        console.error('Error returning book:', error);
      } finally {
        setReturning(false);
        setReturnBookId(null);
      }
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Borrowed Books</h1>
          <p className="text-muted-foreground">Track all borrowed books and returns</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Borrow Book
        </Button>
      </div>

      <div className="rounded-md border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Book
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Borrowed By
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Borrowed Date
              </th>
              <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                Due Date
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
            {borrowedBooks.map((item) => (
              <tr key={item.id} className="border-b transition-colors hover:bg-muted/50">
                <td className="p-4 align-middle">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                      <BookOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="font-medium">{item.book?.title}</div>
                      <div className="text-sm text-muted-foreground">{item.book?.author?.name}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">{item.user?.name}</div>
                      <div className="text-xs text-muted-foreground">{item.user?.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(item.borrowedAt), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(item.dueDate), 'MMM dd, yyyy')}
                  </div>
                </td>
                <td className="p-4 align-middle">
                  {item.returnedAt ? (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-green-600"></span>
                      Returned
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                      <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-600"></span>
                      Borrowed
                    </span>
                  )}
                </td>
                <td className="p-4 align-middle text-right">
                  {!item.returnedAt && (
                    <Button
                      onClick={() => setReturnBookId(item.id)}
                      variant="ghost"
                      size="sm"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Return
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md mx-4">
            <form onSubmit={handleSubmit}>
              <div className="p-6 space-y-4">
                <h3 className="text-lg font-semibold">
                  Borrow a Book
                </h3>
                <Field>
                  <FieldGroup>
                    <FieldLabel>Book</FieldLabel>
                    <Select
                      required
                      value={formData.bookId}
                      onValueChange={(value) => setFormData({ ...formData, bookId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a book" />
                      </SelectTrigger>
                      <SelectContent>
                        {books.filter(b => !b.borrowedBooks || b.borrowedBooks.length === 0).map((book) => (
                          <SelectItem key={book.id} value={book.id}>
                            {book.title} - {book.author?.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </Field>
                <Field>
                  <FieldGroup>
                    <FieldLabel>User</FieldLabel>
                    <Select
                      required
                      value={formData.userId}
                      onValueChange={(value) => setFormData({ ...formData, userId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name} ({user.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldGroup>
                </Field>
              </div>
              <div className="flex justify-end gap-3 p-6 pt-0">
                <Button
                  type="button"
                  onClick={() => setShowModal(false)}
                  variant="outline"
                  disabled={borrowing}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={borrowing}>
                  {borrowing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Borrow
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <AlertDialog open={!!returnBookId} onOpenChange={(open) => !returning && !open && setReturnBookId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Return</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to mark this book as returned?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={returning}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={(e) => { e.preventDefault(); confirmReturn(); }} disabled={returning}>
              {returning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Confirm Return
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default BorrowedBooks;
