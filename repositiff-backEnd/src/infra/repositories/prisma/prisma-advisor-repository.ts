import { UpdateFieldsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { IAdvisorRepository } from "../IAdvisorRepository.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";


const prismaErrorMessages: Record<string, string> = {
    P2002: "Duplicate value for unique field(s) - PRISMA ERROR CODE P2002",
    P2003: 'Foreign key constraint failed - PRISMA ERROR CODE P2003',
    P2000: 'Value is too long for a column - PRISMA ERROR CODE P2000',
    P2025: 'Record not found - PRISMA ERROR CODE P2025',
    P2006: 'Invalid data for a column - PRISMA ERROR CODE P2006',
    P2016: 'Invalid connection to the database - PRISMA ERROR CODE P2016',
};

export class PrismaAdvisorRepository implements IAdvisorRepository {

    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }
    async deleteAll(): Promise<void> {
        await this._prismaCli.$executeRawUnsafe(`
            TRUNCATE TABLE 
                "Advisor_AcademicWork", 
                "AcademicWork", 
                "Advisor", 
                "Course", 
                "Librarian"
            RESTART IDENTITY CASCADE;
        `);
    }
    async addAdvisor(advisor: Advisor): Promise<Error | Advisor> {
        try {
            const prismaAdvisor = await this._prismaCli.advisor.create({
                data: {
                    id: advisor.id,
                    name: advisor.name,
                    surname: advisor.surname,
                    registrationNumber: advisor.registrationNumber,
                }
            });
            return this.mapperToAdvisor(prismaAdvisor);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
            return new Error("Unexpected Error to database");
        }
    }



    async updateAdvisor(updateFields: UpdateFieldsDTO, id: string): Promise<Error | Advisor> {
        try {
            const advisorUpdated = await this._prismaCli.advisor.update({
                where: {
                    id: id,
                },
                data: updateFields,
            })
            return this.mapperToAdvisor(advisorUpdated);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
            return new Error("Unexpected Error to database");
        }
        // throw new Error("Method not implemented.");
    }

    async deleteAdvisor(idAdvisor: string): Promise<Error | Advisor> {
        // console.log(`ID: ${idAdvisor}\n`)
        try {
            const advisorDeleted = await this._prismaCli.advisor.delete({
                where: {
                    id: idAdvisor
                }
            });
            return this.mapperToAdvisor(advisorDeleted);
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                return new Error(customMessage);
            }
            return new Error("Unexpected Error to database");
        }
        // throw new Error("Method not implemented.");
    }

    async listAllAdvisors(): Promise<Advisor[]> {
        try {
            const result = await this._prismaCli.advisor.findMany()
            let listAdvisor = result.map((advisor) => {
                const resultMapper = this.mapperToAdvisor(advisor);
                if (resultMapper instanceof Error) {
                    console.log("Unexpected error");
                    console.log(resultMapper);
                    throw new Error("Information incompatible with the database and business rules ", resultMapper);
                }
                return resultMapper
            });
            return listAdvisor;
        } catch (error: any) {
            return (error)
        }
    }

    async countAllAdvisors(): Promise<null | number> {
        try {
            return await this._prismaCli.advisor.count();
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
            throw new Error("Unexpected Error to database");
        }
    }

    async findAdvisorById(id: string): Promise<null | Advisor> {
        try {
            const advisorPrisma = await this._prismaCli.advisor.findUnique({
                where: {
                    id: id
                }
            })
            if (!advisorPrisma)
                return null;
            const result = this.mapperToAdvisor(advisorPrisma);
            if (result instanceof Error) {
                console.log("Unexpected error");
                console.log(advisorPrisma);
                throw new Error("Information incompatible with the database and business rules ", result);
            }
            return result as Advisor;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
            throw new Error("Unexpected Error to database");
        }
    }
    async advisorExisting(idAdvisor: string): Promise<boolean> {
        try {
            const advisorExisting = (await this._prismaCli.advisor.count({
                where: {
                    id: idAdvisor
                }
            }) === 1);
            return (advisorExisting);
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
    async findAdvisorByRegistrationNumber(registrationNumber: string): Promise<null | Advisor> {
        try {
            const advisorPrisma = await this._prismaCli.advisor.findUnique({
                where: {
                    registrationNumber: registrationNumber
                }
            })
            if (!advisorPrisma)
                return (null);
            const result = this.mapperToAdvisor(advisorPrisma);
            if (result instanceof Error) {
                console.log("Unexpected error");
                console.log(advisorPrisma);
                throw new Error("Information incompatible with the database and business rules ", result);
            }
            return result as Advisor;
        } catch (error: any) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
        }
        throw new Error("Unexpected error");
    }

    mapperToAdvisor(advisor: any): Advisor | Error {
        const advisorProps: AdvisorProps = {
            name: advisor.name,
            surname: advisor.surname,
            registrationNumber: advisor.registrationNumber,
        };
        const advisorMappingToDomain = AdvisorFactory.createAdvisor(
            advisorProps,
            advisor.id,
        );
        return advisorMappingToDomain.value;
    }

}