import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { AdvisorErrors } from "@src/domain/errorsDomain/advisorErrorDomain.js";
import { Either, Left, Right } from "@src/error_handling/either.js";

type response = Either<DomainError, Advisor>;

export class CreateAdvisorUseCase {
    constructor(
        private advisorRepostory: IAdvisorRepository
    ) { }
    async execute(newAdvisorProps: AdvisorProps): Promise<response> {
        const advisorOrError = AdvisorFactory.createAdvisor(newAdvisorProps);
        if (advisorOrError.isLeft()) {
            return new Left(advisorOrError.value);
        }
        const advisor = advisorOrError.value as Advisor;
        // console.log(advisor);

        const advisorExisting = await this.advisorRepostory.findAdvisorByRegistrationNumber(advisor.registrationNumber);
        if (advisorExisting.isRight()) {
            return new Left(AdvisorErrors.RegistrationAlreadyExisting());
        }
        const advisorRegisteredOrError = await this.advisorRepostory.cadastrationNewAdvisor(advisor);
        if (advisorRegisteredOrError.isLeft())
            return new Left(advisorRegisteredOrError.value);
        return new Right(advisorRegisteredOrError.value as Advisor);
    }

}
