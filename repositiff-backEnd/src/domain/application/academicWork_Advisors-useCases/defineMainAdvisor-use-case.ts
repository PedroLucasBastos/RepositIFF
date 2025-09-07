import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface DefineProps {
  academicWorkId: string;
  advisorId: string;
}

export class DefineMainAdvisorUseCase {
  constructor(private repo: IAcademicWorkRepository) {}
  async execute(props: DefineProps, userRole: string): Promise<Either<DomainError, boolean>> {
    if (userRole !== Role.LIBRARIAN) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "PERMISSION_DENIED",
          "your role does not have permission",
          new Error("Permission denied")
        )
      );
    }
    const consultingResponseMainAdvisor = await this.repo.selectMainAdvisor(props.academicWorkId);

    if (consultingResponseMainAdvisor instanceof Error)
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_FIND_ADVISOR", consultingResponseMainAdvisor.message)
      );

    if (props.advisorId === consultingResponseMainAdvisor)
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_DEFINE_MAIN_ADVISOR", "ADVISOR IS A MAIN ADVISOR")
      );

    if (consultingResponseMainAdvisor)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_DEFINE_MAIN_ADVISOR",
          "A main advisor is already defined for this academic work."
        )
      );
    const operationResponse = await this.repo.defineMainAdvisor(props.academicWorkId, props.advisorId);
    if (operationResponse instanceof Error)
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_DEFINE_MAIN_ADVISOR", operationResponse.message)
      );
    return new Right(true);
  }
}
