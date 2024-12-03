import { UpdateFieldsDTO } from "@src/domain/application/advisor-useCases/updateAdvisor.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Either } from "@src/error_handling/either.js";

export interface IAdvisorRepository {
    cadastrationNewAdvisor(advisor: Advisor): Promise<Either<DomainError, Advisor>>;

    deleteAdvisor(idAdvisor: string): Promise<Either<Error, Advisor>>;

    countAllAdvisors(): Promise<Either<Error, number>>;

    updateAdvisor(updateFields: UpdateFieldsDTO, id: string): Promise<Either<Error, Advisor>>;

    findAdvisorById(id: String): Promise<Either<Error, Advisor>>;

    advisorExisting(id: String): Promise<Error | boolean>;

    findAdvisorByRegistrationNumber(registrationNumber: string): Promise<Either<null, Advisor>>;
}