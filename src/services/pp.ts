
// Mock data service to simulate fetching people by role
export interface Person {
  id: number;
  name: string;
  email: string;
  phone: string;
  pan: string;
  status: string;
  role: string;
}

const mockPeopleData: Person[] = [
  // Authors
  { id: 1, name: 'Rajesh Kumar', email: 'rajesh@email.com', phone: '+91 98765 43210', pan: 'ABCDE1234F', status: 'Active', role: 'author' },
  { id: 2, name: 'Priya Sharma', email: 'priya@email.com', phone: '+91 87654 32109', pan: 'PQRSX6789Z', status: 'Active', role: 'author' },
  { id: 3, name: 'Arjun Patel', email: 'arjun@email.com', phone: '+91 76543 21098', pan: 'LMNOP1122Y', status: 'Inactive', role: 'author' },
  
  // Translators
  { id: 4, name: 'Meera Nair', email: 'meera@email.com', phone: '+91 65432 10987', pan: 'TRAN1234X', status: 'Active', role: 'translator' },
  { id: 5, name: 'Vikram Singh', email: 'vikram@email.com', phone: '+91 54321 09876', pan: 'TRAN5678Z', status: 'Active', role: 'translator' },
  
  // Editors
  { id: 6, name: 'Anjali Reddy', email: 'anjali@email.com', phone: '+91 43210 98765', pan: 'EDIT9999Q', status: 'Active', role: 'editor' },
  { id: 7, name: 'Suresh Gupta', email: 'suresh@email.com', phone: '+91 32109 87654', pan: 'EDIT3333R', status: 'Active', role: 'editor' },
  
  // Proprietors
  { id: 8, name: 'Ram Prasad', email: 'ram@email.com', phone: '+91 98765 12345', pan: 'PROP1234A', status: 'Active', role: 'proprietor' },
  { id: 9, name: 'Lakshmi Devi', email: 'lakshmi@email.com', phone: '+91 87654 23456', pan: 'PROP5678B', status: 'Active', role: 'proprietor' },
  
  // Agencies
  { id: 10, name: 'Literary Associates', email: 'contact@litassoc.com', phone: '+91 76543 34567', pan: 'AGEN1111C', status: 'Active', role: 'agency' },
  { id: 11, name: 'Creative Partners', email: 'info@creative.com', phone: '+91 65432 45678', pan: 'AGEN2222D', status: 'Active', role: 'agency' },
  
  // Publishers
  { id: 12, name: 'Modern Publications', email: 'editor@modern.com', phone: '+91 54321 56789', pan: 'PUBL3333E', status: 'Active', role: 'publisher' },
  { id: 13, name: 'Heritage Books', email: 'contact@heritage.com', phone: '+91 43210 67890', pan: 'PUBL4444F', status: 'Active', role: 'publisher' },
  { id: 14, name: 'New Age Press', email: 'info@newage.com', phone: '+91 32109 78901', pan: 'PUBL5555G', status: 'Inactive', role: 'publisher' },
];

export const getPeopleByRole = (role: string): Promise<Person[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredPeople = mockPeopleData.filter(person => 
        person.role === role && person.status === 'Active'
      );
      resolve(filteredPeople);
    }, 300); // Simulate API delay
  });
};

export const getAllPeople = (): Promise<Person[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockPeopleData);
    }, 300);
  });
};
