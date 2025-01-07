import { UpdateFieldsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { IAdvisorRepository } from "../IAdvisorRepository.js";
import { PrismaClient } from "@prisma/client";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";


export class PrismaAdvisorRepository implements IAdvisorRepository {

    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }
    async cadastrationNewAdvisor(advisor: Advisor): Promise<Either<DomainError, Advisor>> {
        try {
            const prismaAdvisor = await this._prismaCli.advisor.create({
                data: {
                    id: advisor.id,
                    name: advisor.name,
                    surname: advisor.surname,
                    registrationNumber: advisor.registrationNumber,
                }
            });
            const advisorMappingToDomain = this.mapperToAdvisor(prismaAdvisor);
            return new Right(advisorMappingToDomain);
        } catch (error: any) {
            return new Left(new DomainError(ErrorCategory.Persistence,
                "Unexpected error in registraded a new advisor",
                error.message
            ));
        }
    }

    async deleteAdvisor(idAdvisor: string): Promise<Either<DomainError, Advisor>> {
        // console.log(`ID: ${idAdvisor}\n`)
        try {
            const advisorDeleted = await this._prismaCli.advisor.delete({
                where: {
                    id: idAdvisor
                }
            });
            const advisorMappingToDomain = this.mapperToAdvisor(advisorDeleted);
            return new Right(advisorMappingToDomain);
        } catch (error: any) {
            return new Left(new DomainError(ErrorCategory.Persistence,
                "Unexpected error in delete a advisor",
                error.message
            ));
        }
        // throw new Error("Method not implemented.");
    }

    async listAllAdvisors(): Promise<Advisor[]> {
        try {
            const result = await this._prismaCli.advisor.findMany()
            let listAdvisor = result.map((advisor) => {
                return this.mapperToAdvisor(advisor);
            });
            return listAdvisor;
        } catch (error: any) {
            return (error)
        }
    }

    async countAllAdvisors(): Promise<Either<Error, number>> {
        try {
            return new Right(await this._prismaCli.advisor.count());
        } catch (error: any) {
            return new Left(error)
        }
    }

    async updateAdvisor(updateFields: UpdateFieldsDTO, id: string): Promise<Either<Error, Advisor>> {
        try {
            const advisorUpdated = await this._prismaCli.advisor.update({
                where: {
                    id: id,
                },
                data: updateFields,
            })
            const advisorMappingToDomain = this.mapperToAdvisor(advisorUpdated);
            return new Right(advisorMappingToDomain);
        } catch (error: any) {
            return new Left(new DomainError(ErrorCategory.Persistence,
                "Unexpected error in update a advisor",
                error.message
            ));
        }
        // throw new Error("Method not implemented.");
    }
    async findAdvisorById(id: string): Promise<Either<null, Advisor>> {
        try {
            const advisorPrisma = await this._prismaCli.advisor.findUnique({
                where: {
                    id: id
                }
            })
            if (!advisorPrisma)
                return new Left(null)
            const advisorMappingToDomain = this.mapperToAdvisor(advisorPrisma);
            return new Right(advisorMappingToDomain);
        } catch (error: any) {
            return new Left(error)
        }
        throw new Error("Method not implemented.");
    }
    async advisorExisting(idAdvisor: string): Promise<Error | boolean> {
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
    async findAdvisorByRegistrationNumber(registrationNumber: string): Promise<Either<null, Advisor>> {
        try {
            const advisorPrisma = await this._prismaCli.advisor.findUnique({
                where: {
                    registrationNumber: registrationNumber
                }
            })
            if (!advisorPrisma)
                return new Left(null)
            const advisorMappingToDomain = this.mapperToAdvisor(advisorPrisma);
            return new Right(advisorMappingToDomain);
        } catch (error: any) {
            return new Left(error)
        }
        throw new Error("Method not implemented.");
    }

    mapperToAdvisor(advisor: any): Advisor {
        const advisorProps: AdvisorProps = {
            name: advisor.name,
            surname: advisor.surname,
            registrationNumber: advisor.registrationNumber,
        };
        const advisorMappingToDomain = new Advisor(
            advisorProps,
            advisor.id,
        );
        return advisorMappingToDomain;
    }

}