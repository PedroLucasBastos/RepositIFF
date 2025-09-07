import { User, userProps } from "@src/domain/entities/user.js";
import { IUsersRepository, IUserDTO, IUserUpdateDTO } from "../ILibrarianRepostory.js";
import { PrismaClient } from "@prisma/client";

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
