import { PersonType } from '@/models/people.model';

export type RightsType = 'SELLING' | 'BUYING' | 'EBOOK_RIGHTS';

export interface Person {
  id: number;
  name: string;
  personType: PersonType;
}

export interface RightsPayload {
  rights: RightsType;                 // SELLING / BUYING / EBOOK_RIGHTS
  role: PersonType;                    // AUTHOR / PUBLISHER / PROPRIETOR / AGENCIES
  personId: number;                    // Linked person
  person?: {
    id: number;
    personType: string;
    name: string;
    email?: string;
    phone?: string;
  };
  bookId: number;                      // Linked book
  advancePaid?: number;                // Advance amount
  advancePaidDate?: string | null;     // Optional date of advance
  royalties?: number;                  // Royalties percentage
  languages: string;                   // Language
  country: string;                     // Country name
  currency: string;                    // Currency code
  state?: string;                      // State (India only)
  domesticRights?: string[];           // For India — list of domestic rights
  publisherName?: string;              // For International — publisher
  rightsType: RightsType;              // Same as rights in your case
  isActive: boolean;                   // Status
  additionalNotes?: string;           // Optional additional notes
  id?: number;                         // Optional for update
}
