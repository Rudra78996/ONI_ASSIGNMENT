import { useState, useEffect } from 'react';
import { authorsApi, Author } from '../api';
import { Plus, Edit2, Trash2, Calendar, BookOpen, LayoutGrid, List, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
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

const Authors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [deleteAuthorId, setDeleteAuthorId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    bio: string;
    birthDate: Date | undefined;
  }>({
    name: '',
    bio: '',
    birthDate: undefined,
  });

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const data = await authorsApi.getAll();
      setAuthors(data);
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const dataToSend = {
        name: formData.name,
        ...(formData.bio && { bio: formData.bio }),
        ...(formData.birthDate && { birthDate: formData.birthDate.toISOString().split('T')[0] }),
      };
      
      if (editingAuthor) {
        await authorsApi.update(editingAuthor.id, dataToSend);
      } else {
        await authorsApi.create(dataToSend);
      }
      setShowModal(false);
      resetForm();
      fetchAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (deleteAuthorId) {
      setDeleting(true);
      try {
        await authorsApi.delete(deleteAuthorId);
        fetchAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
      } finally {
        setDeleting(false);
        setDeleteAuthorId(null);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', bio: '', birthDate: undefined });
    setEditingAuthor(null);
  };

  const openModal = (author?: Author) => {
    if (author) {
      setEditingAuthor(author);
      setFormData({
        name: author.name,
        bio: author.bio || '',
        birthDate: author.birthDate ? new Date(author.birthDate) : undefined,
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
          <h1 className="text-3xl font-bold tracking-tight">Authors</h1>
          <p className="text-muted-foreground">Manage your library's authors</p>
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
            Add Author
          </Button>
        </div>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {authors.map((author) => (
            <Card key={author.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-1">
                    <CardTitle className="text-xl line-clamp-1">{author.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {author.books?.length || 0} {author.books?.length === 1 ? 'book' : 'books'}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      onClick={() => openModal(author)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => setDeleteAuthorId(author.id)}
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
                {author.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">{author.bio}</p>
                )}
                {author.birthDate && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Born {format(new Date(author.birthDate), 'MMM dd, yyyy')}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="rounded-md border">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Name
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Bio
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Birth Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                  Books
                </th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author) => (
                <tr key={author.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle font-medium">{author.name}</td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground line-clamp-2">
                      {author.bio || '-'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground">
                      {author.birthDate ? format(new Date(author.birthDate), 'MMM dd, yyyy') : '-'}
                    </span>
                  </td>
                  <td className="p-4 align-middle">
                    <span className="text-sm text-muted-foreground">
                      {author.books?.length || 0}
                    </span>
                  </td>
                  <td className="p-4 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        onClick={() => openModal(author)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => setDeleteAuthorId(author.id)}
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
                <CardTitle>{editingAuthor ? 'Edit Author' : 'Add New Author'}</CardTitle>
                <CardDescription>
                  {editingAuthor ? 'Update author information' : 'Add a new author to your library'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="name">Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter author name"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                    <textarea
                      id="bio"
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Enter author bio (optional)"
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="birthDate">Birth Date</FieldLabel>
                    <DatePicker
                      date={formData.birthDate}
                      onDateChange={(date) => setFormData({ ...formData, birthDate: date })}
                      placeholder="Select birth date"
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
                  {editingAuthor ? 'Update' : 'Create'}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      <AlertDialog open={!!deleteAuthorId} onOpenChange={(open) => !deleting && !open && setDeleteAuthorId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the author and all their books.
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

export default Authors;
