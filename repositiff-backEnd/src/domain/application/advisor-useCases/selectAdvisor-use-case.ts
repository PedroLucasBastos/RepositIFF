import { Advisor } from "@src/domain/entities/advisor.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { Either } from '@src/error_handling/either.js';


export class SelectAdvisorUseCase {
    constructor(repository: IAdvisorRepository) { }

    // async execute(advisorRegistrationNumber: string): Promise<Either<DomainError, Advisor>> {

    // }
}