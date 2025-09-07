import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface IDelAdvisorProps {
  academicWorkId: string;
  advisorId: string;
}

export class DelAdvisorInAcademicWorkUseCase {
  constructor(private repo: IAcademicWorkRepository) {}

  async execute(props: IDelAdvisorProps, userRole: string): Promise<Either<DomainError, void>> {
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
    const operation = await this.repo.deleteAdvisorToAcademicWork(props.academicWorkId, props.advisorId);
    if (operation instanceof Error) {
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_DELETE_ADVISOR_TO_ACADEMICWORK_LINK", operation.message)
      );
    }
    return new Right(undefined);
  }
}
