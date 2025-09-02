import { Librarian, librarianProps } from "@src/domain/entities/librarian.js";
import { ILibrarianRepository, librarianDTO, librarianUpdateDTO } from "../ILibrarianRepostory.js";
import { PrismaClient } from "@prisma/client";

export class PrismaLibrarianRepository implements ILibrarianRepository {
  private _prismaCli: PrismaClient;
  constructor() {
    this._prismaCli = new PrismaClient();
  }
  async update(librarian: librarianUpdateDTO): Promise<void> {
    try {
      await this._prismaCli.librarian.update({
        where: {
          id: librarian.id,
        },
        data: {
          name: librarian.name,
          email: librarian.email,
          registrationNumber: librarian.registrationNumber,
          pass: librarian.password,
        },
      });
    } catch (error) {
      console.error("Error details: ", error); // Adicione essa linha para imprimir o erro específico
      console.log("Librarian failed to registered!");
      return Promise.reject();
    }
  }
  async newLibrarian(librarian: Librarian): Promise<void> {
    try {
      const librarianRegistred = await this._prismaCli.librarian.create({
        data: {
          id: librarian.id,
          name: librarian.name,
          email: librarian.email,
          registrationNumber: librarian.registrationNumber,
          pass: librarian.pass,
        },
      });
      // console.log("Librarian as registred!");
      // return librarianRegistred;
    } catch (error) {
      console.error("Error details: ", error); // Adicione essa linha para imprimir o erro específico
      console.log("Librarian failed to registered!");
      return Promise.reject();
    }
  }
  async findById(id: string): Promise<librarianDTO | null> {
    try {
      // console.log("FindByEmail in try")
      // console.log(`Email: ${email}`)
      const librarian = await this._prismaCli.librarian.findUnique({
        where: {
          id: id, // Compara o campo "id" do banco de dados com a variável "id"
        },
      });
      if (!librarian) return null;

      const librarianMapping: librarianDTO = {
        id: librarian.id,
        name: librarian.name,
        email: librarian.email,
        registrationNumber: librarian.registrationNumber,
      };
      return librarianMapping;
    } catch (error) {
      throw new Error("Error to findById Methods.   " + error);
    }
  }
  async findByEmail(email: string): Promise<Librarian | void> {
    try {
      // console.log("FindByEmail in try")
      // console.log(`Email: ${email}`)
      const librarian = await this._prismaCli.librarian.findUnique({
        where: {
          email: email, // Compara o campo "email" do banco de dados com a variável "email"
        },
      });
      if (librarian) return this.mapperLibrarian(librarian);
    } catch (error) {
      throw new Error("Error to findByEmail Methods.   " + error);
    }
  }

  async listAll(): Promise<Librarian[]> {
    const list = await this._prismaCli.librarian.findMany();
    const librarians = list.map((librarian) => {
      return this.mapperLibrarian(librarian);
    });
    return librarians;
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<Librarian | void> {
    try {
      const librarian = await this._prismaCli.librarian.findUnique({
        where: {
          registrationNumber: registrationNumber,
        },
      });
      if (librarian) return this.mapperLibrarian(librarian);
    } catch (error) {
      throw new Error("Error to findByRegistrationNumber Methods.   " + error);
    }
  }

  private mapperLibrarian(prismaData: any): Librarian {
    return new Librarian(
      {
        name: prismaData.name,
        email: prismaData.email,
        registrationNumber: prismaData.registrationNumber,
        password: prismaData.pass,
      },
      prismaData.id
    );
  }
}
