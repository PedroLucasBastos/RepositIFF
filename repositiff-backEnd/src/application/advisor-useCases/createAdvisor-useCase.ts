import { Advisor, AdvisorProps } from "@src/domain/advisor.js";
import { AdvisorFactory } from "@src/domain/factories/advisorFactory.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";

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
            return new DomainError(ErrorCategory.Application, "Error when registering advisor", ["Advisor already exists on the platform"]);
        }
        await this.advisorRepostory.cadastrationNewAdvisor(advisor);
    }

}
