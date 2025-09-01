import {
  getAll as getPersons
} from "@/services/person.service";

import {
  getAll as getBooks
} from "@/services/book.service";

import {
  getAll as getOwnPublishing
} from "@/services/ownPublishing.service";
import { getAll as getBuyingRights } from "@/services/buyingRights.service";
import { getAll as getSellingRights } from "@/services/sellingRights.service";

// Mapping helper
function mapNames(records: any[], persons: any[], books: any[] = []) {
  return records.map(r => ({
    ...r,
    personName: persons.find(p => p.id === r.personId)?.name || "Unknown",
    bookName: r.bookId ? (books.find(b => b.id === r.bookId)?.title || "Unknown") : undefined
  }));
}

export default function Reports() {
  const [data, setData] = useState([]);
  const [persons, setPersons] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let fetchedData: any[] = [];
      let allPersons: any[] = [];
      let allBooks: any[] = [];

      if (selectedMainTab === "role") {
        fetchedData = await getPersons(selectedRoleTab); // e.g., "AUTHOR"
      }

      if (selectedMainTab === "books") {
        allPersons = await getPersons();
        fetchedData = await getBooks();
        fetchedData = mapNames(fetchedData, allPersons);
      }

      if (selectedMainTab === "rights") {
        allPersons = await getPersons();
        allBooks = await getBooks();

        if (selectedRightsTab === "own") fetchedData = await getOwnPublishing();
        if (selectedRightsTab === "buy") fetchedData = await getBuyingRights();
        if (selectedRightsTab === "sell") fetchedData = await getSellingRights();

        fetchedData = mapNames(fetchedData, allPersons, allBooks);
      }

      setPersons(allPersons);
      setBooks(allBooks);
      setData(fetchedData);
    }
    fetchData();
  }, [selectedMainTab, selectedRoleTab, selectedRightsTab]);
}
