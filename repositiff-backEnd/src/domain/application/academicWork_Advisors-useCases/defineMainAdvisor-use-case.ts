import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";


export interface DefineProps {
    academicWorkId: string, advisorId: string
}

export class DefineMainAdvisorUseCase {

    constructor(
        private repo: IAcademicWorkRepository
    ) { }

    async execute(props: DefineProps): Promise<Either<DomainError, boolean>> {

        const consultingResponse = await this.repo.selectMainAdvisor(props.academicWorkId, props.advisorId);
        if (consultingResponse instanceof Error)
            return new Left(new DomainError(ErrorCategory.Application,
                "ERROR_TO_FIND_ADVISOR",
                consultingResponse.message))
        if (consultingResponse)
            return new Left(new DomainError(
                ErrorCategory.Application,
                "ERROR_TO_DEFINE_MAIN_ADVISOR",
                "A main advisor is already defined for this academic work."
            ));
        const operation = await this.repo.defineMainAdvisor(props.academicWorkId, props.advisorId);
        if (operation instanceof Error)
            return new Left(new DomainError(
                ErrorCategory.Application,
                "ERROR_TO_DEFINE_MAIN_ADVISOR",
                operation.message
            ));
        return new Right(true);
    }

}