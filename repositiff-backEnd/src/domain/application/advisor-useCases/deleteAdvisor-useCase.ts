import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { AdvisorErrors } from "../../errorsDomain/advisorErrorDomain.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
export interface deleteAdvisor {
    advisorIdentification: string;
}
export class DeleteAdvisorUseCase {
    constructor(private repository: IAdvisorRepository) { }
    async execute(id: deleteAdvisor): Promise<Either<DomainError, void>> {
        const idAdvisor = id.advisorIdentification;
        const advisorExisting = await this.repository.advisorExisting(idAdvisor);
        if (!advisorExisting) {
            return new Left(AdvisorErrors.AdvisorNotFound());
        }
        this.repository.deleteAdvisor(idAdvisor);
        return new Right(undefined)
    }
}