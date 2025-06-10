import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface IDelAdvisorProps {
    academicWorkId: string,
    advisorId: string
}

export class DelAdvisorInAcademicWorkUseCase {

    constructor(private repo: IAcademicWorkRepository) { }

    async execute(props: IDelAdvisorProps): Promise<Either<DomainError, void>> {
        const operation = await this.repo.deleteAdvisorToAcademicWork(
            props.academicWorkId,
            props.advisorId
        )
        if (operation instanceof Error) {
            return new Left(
                new DomainError(
                    ErrorCategory.Application,
                    "ERROR_TO_DELETE_ADVISOR_TO_ACADEMICWORK_LINK",
                    operation.message
                )
            )
        }
        return new Right(undefined);
    }
}