import { PersonType } from '@/models/people.model';

export interface Person {
  id: number;
  name: string;
  personType: PersonType;

}

export interface RightsPayload {
  rights: RightsType;
  role: PersonType;
  personId: number;
  bookId: number;
  advancePaid?: number;
  advancePaidDate?: string | null;
  royalties?: number;
  languages: string;
  country: string;
  currency: string;
  state: string;
  rightsType: RightsType;
  isActive: boolean;
  id?: number; 
}


export type RightsType = 'SELLING' | 'BUYING' | 'EBOOK_RIGHTS';