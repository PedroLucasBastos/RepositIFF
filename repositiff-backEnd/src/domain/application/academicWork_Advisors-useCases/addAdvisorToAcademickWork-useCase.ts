import { AdvisorProps } from "@src/domain/entities/advisor.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
import { IAdvisorDTO } from "@src/infra/repositories/IAdvisorRepository.js";

export type AddAdvisorToAcademicWorkProps = {
  academicWorkId: string;
  advisorId: string;
};

interface response {
  list: IAdvisorDTO[];
}
export class AddAdvisorToAcademicWorkUseCase {
  constructor(private repository: IAcademicWorkRepository) {}

  async execute(props: AddAdvisorToAcademicWorkProps): Promise<Either<DomainError, void>> {
    const { academicWorkId, advisorId } = props;
    const repoResponse = await this.repository.addAdvisorToAcademicWork(academicWorkId, advisorId);
    if (repoResponse instanceof Error) {
      return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_LINK_ACADEMIC-WORK_TO_ADVISOR", repoResponse.message));
    }
    return new Right(undefined);
  }
}
