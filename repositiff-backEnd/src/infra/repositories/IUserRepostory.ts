import { User } from "@src/domain/entities/user.js";

export interface IUserDTO {
  id: string;
  name: string;
  email: string;
  role: string;
  registrationNumber: string;
}

export interface IUserUpdateDTO {
  id: string;
  name?: string;
  email?: string;
  registrationNumber?: string;
  password?: string;
}

export interface IUsersRepository {
  newUser(user: User): Promise<void>;
  update(librarian: IUserUpdateDTO): Promise<void>;
  findById(id: String): Promise<IUserDTO | null>;
  findByEmail(email: string): Promise<User | void>;
  findByRegistrationNumber(registrationNumber: string): Promise<User | void>;
  listAll(): Promise<User[]>;
}
