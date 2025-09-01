import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { BookOpen, Plus, Edit, Trash2, ArrowUpDown, Filter, Search, Loader2 } from 'lucide-react';
import { getAllPersons } from "@/services/people.service";
import { getBooks, deleteBook } from '@/services/book.service';
import { Book } from '@/models/book.model';

const Books = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterYear, setFilterYear] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [authorMap, setAuthorMap] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    fetchAuthors();
    fetchBooks();
  }, []);

  const fetchAuthors = async () => {
    try {
      const persons = await getAllPersons();
      const authors = persons.filter(person => person.personType === 'AUTHOR');
      const map = authors.reduce((acc, author) => {
        acc[author.id] = author.name;
        return acc;
      }, {} as { [key: number]: string });
      setAuthorMap(map);
    } catch (error: any) {
      toast({
        title: 'Error Fetching Authors',
        description: error.message || 'Failed to fetch authors',
        variant: 'destructive',
      });
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const response = await getBooks();
      setBooks(response.data.books || []);
      console.log("Fetched books:", response.data.books);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch books',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this book?')) {
      try {
        await deleteBook(id);
        setBooks(prevBooks => prevBooks.filter(b => b.id !== id));
        toast({
          title: 'Book Deleted',
          description: 'Book has been deleted successfully',
          variant: 'destructive',
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to delete book',
          variant: 'destructive',
        });
      }
    }
  };

  const filteredSortedBooks = useMemo(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(book => {
        const bookTitle = book.name.toLowerCase();
        const query = searchQuery.toLowerCase();
        return bookTitle.includes(query) || book.isbn.toLowerCase().includes(query);
      });
    }

    if (filterYear) {
      filtered = filtered.filter(b => b.year.toString() === filterYear);
    }

    return filtered.sort((a, b) => {
      const titleA = a.name.toLowerCase();
      const titleB = b.name.toLowerCase();
      return sortAsc ? titleA.localeCompare(titleB) : titleB.localeCompare(titleA);
    });
  }, [books, filterYear, sortAsc, searchQuery]);

  const years = ['All Years', ...Array.from(new Set(books.map(b => b.year).filter(Boolean)))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading books...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black">Books Management</h1>
          <p className="text-muted-foreground">Manage books in the catalog</p>
        </div>
        <Button onClick={() => navigate('/books/add')} className="btn-blue w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Book
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by book title or ISBN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-start sm:justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4 space-y-4">
              <h4 className="font-semibold text-sm text-gray-700">Filter Options</h4>
              <hr />
              <div>
                <label className="text-sm font-medium text-gray-600 mb-1 block">Year</label>
                <Select
                  value={filterYear || 'All Years'}
                  onValueChange={(value) => setFilterYear(value === 'All Years' ? '' : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Years" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="secondary"
            onClick={() => setSortAsc(prev => !prev)}
            className="flex items-center gap-2"
          >
            <ArrowUpDown className="h-4 w-4" />
            Sort by Title ({sortAsc ? 'A-Z' : 'Z-A'})
          </Button>
        </div>
      </div>

      <BookTable books={filteredSortedBooks} handleDelete={handleDelete} navigate={navigate} searchQuery={searchQuery} authorMap={authorMap} />
    </div>
  );
};

const BookTable = ({
  books,
  handleDelete,
  navigate,
  searchQuery,
  authorMap,
}: {
  books: Book[];
  handleDelete: (id: number) => void;
  navigate: (url: string) => void;
  searchQuery: string;
  authorMap: { [key: number]: string };
}) => {
  if (books.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-muted-foreground">No books found</h3>
          <p className="text-sm text-muted-foreground">
            {searchQuery
              ? `No books match your search "${searchQuery}"`
              : "No books available in the catalog"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* Mobile list (xs) */}
      <div className="sm:hidden grid gap-4">
{books.map((book) => (
<Card
key={book.id}
className="relative overflow-hidden rounded-2xl border bg-white/80 dark:bg-slate-900/70 shadow-sm ring-1 ring-black/5 dark:ring-white/10 transition-all duration-200 hover:shadow-md"
>
{/* Accent bar */}
<div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-rose-500" />

  <CardContent className="p-4 space-y-4">
    {/* Title + actions */}
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <h3 className="text-base font-semibold leading-snug text-foreground break-words">
          {book.name || "-"}
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {authorMap[book.authorId] || "N/A"}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/books/edit/${book.id}`)}
          aria-label="Edit book"
          className="h-9 w-9 p-0 rounded-full"
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          size="sm"
          variant="destructive"
          onClick={() => handleDelete(book.id)}
          aria-label="Delete book"
          className="h-9 w-9 p-0 rounded-full"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>

    {/* Quick badges */}
    <div className="flex flex-wrap items-center gap-2">
      {book.Language && (
        <Badge variant="outline" className="text-[11px] tracking-wide">
          {book.Language.toUpperCase()}
        </Badge>
      )}
      {book.ownType && (
        <Badge variant="secondary" className="text-[11px]">
          {String(book.ownType).toLowerCase().replace(/_/g, " ")}
        </Badge>
      )}
      {book.category && (
        <Badge variant="default" className="text-[11px] capitalize">
          {String(book.category).toLowerCase().replace(/_/g, " ")}
        </Badge>
      )}
      {book.year ? (
        <Badge variant="outline" className="text-[11px]">{book.year}</Badge>
      ) : null}
    </div>

    {/* Label–Value pairs */}
    <dl className="rounded-xl bg-muted/30 dark:bg-white/5 divide-y divide-border overflow-hidden">
      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Book Name</dt>
        <dd className="text-sm font-medium text-right break-words max-w-[65%]">
          {book.name || "-"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Author</dt>
        <dd className="text-sm font-medium text-right break-words max-w-[65%]">
          {authorMap[book.authorId] || "N/A"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Edition</dt>
        <dd className="text-sm font-medium text-right break-words max-w-[65%]">
          {book.edition || "-"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Price</dt>
        <dd className="text-sm font-medium text-right">
          {book.price ? `₹${book.price}` : "N/A"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">ISBN</dt>
        <dd className="text-sm font-medium text-right font-mono break-all max-w-[65%]">
          {book.isbn || "-"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Language</dt>
        <dd className="text-sm font-medium text-right">
          {book.Language ? book.Language.toUpperCase() : "-"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Type</dt>
        <dd className="text-sm font-medium text-right">
          {book.ownType
            ? String(book.ownType).toLowerCase().replace(/_/g, " ")
            : "-"}
        </dd>
      </div>

      <div className="flex items-center justify-between gap-3 p-3">
        <dt className="text-xs text-muted-foreground">Category</dt>
        <dd className="text-sm font-medium text-right capitalize">
          {book.category
            ? String(book.category).toLowerCase().replace(/_/g, " ")
            : "-"}
        </dd>
      </div>
    </dl>
  </CardContent>
</Card>
))}
</div>

      {/* Desktop/tablet table (sm+) */}
      <Card className="hidden sm:block">
        <CardHeader>
          <CardTitle>Books ({books.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Horizontal scroll container for smaller laptops/tablets */}
          <div className="overflow-x-auto">
            <Table className="min-w-[1000px]">
              <TableHeader>
                <TableRow>
                  <TableHead>Book Title</TableHead>
                  <TableHead>Author Name</TableHead>
                  <TableHead>Year</TableHead>
                  <TableHead>Edition</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell className="font-medium">{book.name}</TableCell>
                    <TableCell>{authorMap[book.authorId] || "N/A"}</TableCell>
                    <TableCell>{book.year}</TableCell>
                    <TableCell>{book.edition}</TableCell>
                    <TableCell>₹{book.price || "N/A"}</TableCell>
                    <TableCell className="font-mono text-xs break-all">{book.isbn}</TableCell>
                    <TableCell className="space-x-1">
                      {book.ownType && (
                        <Badge variant="secondary" className="text-xs">
                          {String(book.ownType).toLowerCase().replace(/_/g, " ")}
                        </Badge>
                      )}
                      {book.Language && (
                        <Badge variant="outline" className="text-xs">
                          {book.Language.toUpperCase()}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default" className="text-xs capitalize">
                        {String(book.category).toLowerCase().replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => navigate(`/books/edit/${book.id}`)}
                          aria-label="Edit book"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(book.id)}
                          aria-label="Delete book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
};


export default Books;
