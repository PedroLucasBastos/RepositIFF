import { User, userProps } from "@src/domain/entities/user.js";
import { IUsersRepository, IUserDTO, IUserUpdateDTO } from "../IUserRepostory.js";
import { Prisma, PrismaClient } from "@prisma/client";

const prismaErrorMessages: Record<string, string> = {
  P2002: "Duplicate value for unique field(s) - PRISMA ERROR CODE P2002",
  P2003: "Foreign key constraint failed - PRISMA ERROR CODE P2003",
  P2000: "Value is too long for a column - PRISMA ERROR CODE P2000",
  P2025: "Record not found - PRISMA ERROR CODE P2025",
  P2006: "Invalid data for a column - PRISMA ERROR CODE P2006",
  P2016: "Invalid connection to the database - PRISMA ERROR CODE P2016",
};
export class PrismaUserRepository implements IUsersRepository {
  private _prismaCli: PrismaClient;
  constructor() {
    this._prismaCli = new PrismaClient();
  }

  async update(user: IUserUpdateDTO): Promise<void> {
    try {
      await this._prismaCli.user.update({
        where: {
          id: user.id,
        },
        data: {
          name: user.name,
          email: user.email,
          registrationNumber: user.registrationNumber,
          pass: user.password,
        },
      });
    } catch (error) {
      console.error("Error details: ", error); // Adicione essa linha para imprimir o erro específico
      console.log("Librarian failed to registered!");
      return Promise.reject();
    }
  }
  async newUser(user: User): Promise<void> {
    try {
      const userRegistred = await this._prismaCli.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          registrationNumber: user.registrationNumber,
          pass: user.pass,
          role: user.role,
        },
      });
      // console.log("Librarian as registred!");
      // return librarianRegistred;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The .code property can be accessed in a type-safe manner
        const customMessage = prismaErrorMessages[error.code] || "Unknown database error occurred";
        console.log(customMessage);
        console.log(error);
        throw new Error(customMessage);
      }
      console.log(error);
    }
  }
  async findById(id: string): Promise<IUserDTO | null> {
    try {
      // console.log("FindByEmail in try")
      // console.log(`Email: ${email}`)
      const user = await this._prismaCli.user.findUnique({
        where: {
          id: id, // Compara o campo "id" do banco de dados com a variável "id"
        },
      });
      if (!user) return null;

      const userMapping: IUserDTO = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        registrationNumber: user.registrationNumber,
      };
      return userMapping;
    } catch (error) {
      throw new Error("Error to findById Methods.   " + error);
    }
  }
  async findByEmail(email: string): Promise<User | void> {
    try {
      // console.log("FindByEmail in try")
      // console.log(`Email: ${email}`)
      const user = await this._prismaCli.user.findUnique({
        where: {
          email: email, // Compara o campo "email" do banco de dados com a variável "email"
        },
      });
      if (user) return this.mapperUser(user);
    } catch (error) {
      throw new Error("Error to findByEmail Methods.   " + error);
    }
  }

  async listAll(): Promise<User[]> {
    const list = await this._prismaCli.user.findMany();
    const librarians = list.map((user) => {
      return this.mapperUser(user);
    });
    return librarians;
  }

  async findByRegistrationNumber(registrationNumber: string): Promise<User | void> {
    try {
      const user = await this._prismaCli.user.findUnique({
        where: {
          registrationNumber: registrationNumber,
        },
      });
      if (user) return this.mapperUser(user);
    } catch (error) {
      throw new Error("Error to findByRegistrationNumber Methods.   " + error);
    }
  }

  private mapperUser(prismaData: any): User {
    return new User(
      {
        name: prismaData.name,
        email: prismaData.email,
        registrationNumber: prismaData.registrationNumber,
        password: prismaData.pass,
        role: prismaData.role,
      },
      prismaData.id
    );
  }
}
