import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export class ChangeVisibilityUseCase {
  constructor(
    private _repo: IAcademicWorkRepository,
    private _fileStorage: IFileStorage
  ) {}

  /*
    Para mudar a visibilidade
    Eu preciso que os dados do banco de dados estajam preenchidos corretamente
    Eu preciso que haja um arquivo na cloudflare
  
  */

  async execute(academimcWorkId: string): Promise<Either<DomainError, void>> {
    const responseConsulting = await this._repo.selectAcademicWork(academimcWorkId);

    if (responseConsulting instanceof Error) {
      return new Left(new DomainError(ErrorCategory.Persistence, "ERROR_ACADEMIC_WORK", responseConsulting.message));
    }
    if (!responseConsulting) {
      return new Left(new DomainError(ErrorCategory.Application, "ACADEMIC_WORK_NOT_FOUND", "Academic work not found"));
    }
    return new Right(undefined);
  }
}
