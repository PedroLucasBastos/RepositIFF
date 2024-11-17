import { Librarian, librarianProps } from "@src/domain/librarian.js";
import { ILibrarianRepository } from "./ILibrarianRepostory.js";
import { PrismaClient } from "@prisma/client";


export class PrismaLibrarianRepository implements ILibrarianRepository {
    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }
    async newLibrarian(librarian: Librarian): Promise<void> {
        try {
            const librarianRegistred = await this._prismaCli.librarian.create({
                data: {
                    id: librarian.id,
                    name: librarian.name,
                    email: librarian.email,
                    registrationNumber: librarian.registrationNumber,
                    pass: librarian.pass
                }
            });
            // console.log("Librarian as registred!");
            // return librarianRegistred;
        } catch (error) {
            console.error("Error details: ", error); // Adicione essa linha para imprimir o erro específico
            console.log("Librarian failed to registered!");
            return Promise.reject();
        }
    }
    findById(id: String): Promise<Librarian | void> {
        throw new Error("Method not implemented.");
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
            if (librarian)
                return this.mapperLibrarian(librarian);
        } catch (error) {
            throw new Error("Error to findByEmail Methods.   " + error);
        }
    }


    private mapperLibrarian(prismaData: any): Librarian {
        console.log(`Dentro do mapper\n ${prismaData}`)
        return new Librarian(
            {
                name: prismaData.name,
                email: prismaData.email,
                registrationNumber: prismaData.registrationNumber,
                password: prismaData.pass
            },
            prismaData.id,
        );
    }
}