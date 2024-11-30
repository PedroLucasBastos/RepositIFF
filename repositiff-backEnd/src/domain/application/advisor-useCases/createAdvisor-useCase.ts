import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { AdvisorErrors } from "@src/domain/errorsDomain/advisorErrorDomain.js";

export class CreateAdvisorUseCase {
    constructor(
        private advisorRepostory: IAdvisorRepository
    ) { }

    async execute(newAdvisorProps: AdvisorProps): Promise<DomainError | void> {
        const advisorOrError = AdvisorFactory.createAdvisor(newAdvisorProps);
        if (advisorOrError.isLeft()) {
            return advisorOrError.value;
        }
        const advisor = advisorOrError.value as Advisor;
        const advisorExisting = await this.advisorRepostory.findAdvisorByRegistrationNumber(advisor.registrationNumber);
        if (advisorExisting) {
            return AdvisorErrors.AdvisorAlreadyExisting();
        }
        await this.advisorRepostory.cadastrationNewAdvisor(advisor);
    }

}
