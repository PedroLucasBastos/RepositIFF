import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { AdvisorErrors } from "../../errorsDomain/advisorErrorDomain.js";

export class DeleteAdvisorUseCase {
    constructor(private advisorRepository: IAdvisorRepository) { }
    async execute(idAdvisor: string): Promise<DomainError | void> {
        console.log(`ID do advisor: ${idAdvisor}`)
        const advisorExisting = await this.advisorRepository.advisorExisting(idAdvisor);
        if (!advisorExisting) {
            return AdvisorErrors.AdvisorNotFound();
        }
        this.advisorRepository.deleteAdvisor(idAdvisor);
    }
}