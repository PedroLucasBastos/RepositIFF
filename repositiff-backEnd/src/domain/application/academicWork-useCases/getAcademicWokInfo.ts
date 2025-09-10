import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import {
  IAcademicWorkRepository,
  IReturnFullAcademicWorkDTO,
} from "@src/infra/repositories/IAcademicWorkRepository.js";

export class GetAcademicWorkInfoUseCase {
  constructor(private _academicRepo: IAcademicWorkRepository) {}

  async execute(id: string, userRole?: string): Promise<Either<Error, IReturnFullAcademicWorkDTO | null>> {
    let result: null | IReturnFullAcademicWorkDTO;
    if (userRole) {
      result = await this._academicRepo.findByIdDoc(id);
    }
    result = await this._academicRepo.findByIdDoc(id, true);

    if (result instanceof Error)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_ACESS_ACADEMIC-WORK_INFO",
          result.message,
          new Error("ERROR_TO_ACESS_ACADEMIC-WORK_INFO")
        )
      );
    return new Right(result);
  }
}
