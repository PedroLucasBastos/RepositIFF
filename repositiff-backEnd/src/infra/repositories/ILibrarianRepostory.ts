import { Librarian } from "@src/domain/entities/librarian.js";

export interface librarianDTO {
  id: string;
  name: string;
  email: string;
  registrationNumber: string;
}

export interface librarianUpdateDTO {
  id: string;
  name?: string;
  email?: string;
  registrationNumber?: string;
  password?: string;
}

export interface ILibrarianRepository {
  newLibrarian(librarian: Librarian): Promise<void>;
  update(librarian: librarianUpdateDTO): Promise<void>;
  findById(id: String): Promise<librarianDTO | null>;
  findByEmail(email: string): Promise<Librarian | void>;
  findByRegistrationNumber(registrationNumber: string): Promise<Librarian | void>;
  listAll(): Promise<Librarian[]>;
}
