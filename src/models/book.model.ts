// book.model.ts
export enum PersonRole {
  AUTHOR = "AUTHOR",
  TRANSLATOR = "TRANSLATOR",
  EDITOR = "EDITOR",
}

export const PersonRoleLabels: Record<PersonRole, string> = {
  [PersonRole.AUTHOR]: "Author",
  [PersonRole.TRANSLATOR]: "Translator",
  [PersonRole.EDITOR]: "Editor",
};

export interface Person {
  id: number;
  name: string;
  personType: PersonRole;
}

export enum OwnType {
  COMPILING = "COMPILING",
  TRANSLATION = "TRANSLATION",
  OWN_WRITING = "OWN_WRITING",
}

export const OwnTypeLabels: Record<OwnType, string> = {
  [OwnType.COMPILING]: "Compiling",
  [OwnType.TRANSLATION]: "Translation",
  [OwnType.OWN_WRITING]: "Own Writing",
};

export enum Category {
  FICTION = "FICTION",
  NON_FICTION = "NON_FICTION",
  POETRY = "POETRY",
  DRAMA = "DRAMA",
  BIOGRAPHY = "BIOGRAPHY",
  CHILDRENS_LITERATURE = "CHILDRENS_LITERATURE",
  HISTORY = "HISTORY",
  SCIENCE = "SCIENCE",
  PHILOSOPHY = "PHILOSOPHY",
  RELIGION = "RELIGION",
  SELF_HELP = "SELF_HELP",
  MYSTERY = "MYSTERY",
  ROMANCE = "ROMANCE",
  THRILLER = "THRILLER",
}

export const CategoryLabels: Record<Category, string> = {
  [Category.FICTION]: "Fiction",
  [Category.NON_FICTION]: "Non-Fiction",
  [Category.POETRY]: "Poetry",
  [Category.DRAMA]: "Drama",
  [Category.BIOGRAPHY]: "Biography",
  [Category.CHILDRENS_LITERATURE]: "Children’s Literature",
  [Category.HISTORY]: "History",
  [Category.SCIENCE]: "Science",
  [Category.PHILOSOPHY]: "Philosophy",
  [Category.RELIGION]: "Religion",
  [Category.SELF_HELP]: "Self Help",
  [Category.MYSTERY]: "Mystery",
  [Category.ROMANCE]: "Romance",
  [Category.THRILLER]: "Thriller",
};

export enum CoverType {
  PAPER_BACK = "PAPER_BACK",
  HARD_COVER = "HARD_COVER",
  DUST_COVER = "DUST_COVER",
  SPIRAL_COVER = "SPIRAL_COVER",
  BOARD_BOOK = "BOARD_BOOK",
}

export const CoverTypeLabels: Record<CoverType, string> = {
  [CoverType.PAPER_BACK]: "Paper Back",
  [CoverType.HARD_COVER]: "Hard Cover",
  [CoverType.DUST_COVER]: "Dust Cover",
  [CoverType.SPIRAL_COVER]: "Spiral Cover",
  [CoverType.BOARD_BOOK]: "Board Book",
};

export interface Book {
  id: number;
  name: string;
  orginalName?: string;
  year: number;
  Language: string;
  edition: string;
  editionYear: number;
  price: number;
  category: Category;
  isbn: string;
  ownType: OwnType;
  description: string;
  pageCount: number;
  publicationDate: number;
  printRun: number;
  coverType: CoverType;
  dimensions: string;
  weight: number;
  reviews?: string;
  awards?: string;
  additionalNotes: string;
  authorId: number;
  translatorId?: number;
  editorId?: number;
  proprietorId?: number;
  agencyId?: number;
  publisherId?: number;
  revenueShare?: number;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
  deletedAt?: string;
}
