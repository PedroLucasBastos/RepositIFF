import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { AdvisorErrors } from "../../errorsDomain/advisorErrorDomain.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
export interface deleteAdvisor {
    advisorIdentification: string;
}
export class DeleteAdvisorUseCase {
    constructor(private _repo: IAdvisorRepository) { }
    async execute(id: string): Promise<Either<DomainError, void>> {
        const advisor = await this._repo.deleteAdvisor(id);
        if (advisor instanceof Error)
            return new Left(
                new DomainError(ErrorCategory.Application,
                    "ERROR-TO-DELETE-ADVISOR",
                    advisor.message));
        return new Right(undefined);
        // const idAdvisor = id.advisorIdentification;
        // const advisorExisting = await this.repository.advisorExisting(idAdvisor);
        // if (!advisorExisting) {
        //     return new Left(AdvisorErrors.AdvisorNotFound());
        // }
        // this.repository.deleteAdvisor(idAdvisor);
        // return new Right(undefined)
    }
}