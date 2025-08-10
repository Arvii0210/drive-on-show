// model.ts

export type PersonType = 'AUTHOR' | 'TRANSLATOR' | 'EDITOR' | 'PROPRIETOR' | 'AGENCY' | 'PUBLISHER';

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface PersonFormData {
  personType: PersonType;
  id?: number;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: string;  // ISO date string YYYY-MM-DD
  gender?: Gender;
  city: string;
  state: string;
  nationality: string;
  panNumber: string;
  bankName: string;
  bankAccountNo: string;
  ifscCode: string;
  nominee: string;
  profilePicture?: File | null;
  document?: File | null;
  website?: string;
  socialMedia?: string;
  shortBio?: string;
  additionalNotes?: string;
  isActive?: boolean;
  languages?: string[]; // Array of language names
}
