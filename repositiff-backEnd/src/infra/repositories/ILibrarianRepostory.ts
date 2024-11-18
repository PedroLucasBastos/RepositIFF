import { Librarian } from "@src/domain/librarian.js";


export interface ILibrarianRepository {
    newLibrarian(librarian: Librarian): Promise<void>;
    findById(id: String): Promise<Librarian | void>;
    findByEmail(email: string): Promise<Librarian | void>;
    findByRegistrationNumber(registrationNumber: string): Promise<Librarian | void>;
    listAll(): Promise<Librarian[]>;
}