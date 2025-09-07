import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import {
  IAcademicWorkRepository,
  IReturnFullAcademicWorkDTO,
} from "@src/infra/repositories/IAcademicWorkRepository.js";

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

  async execute(academimcWorkId: string, userRole: string): Promise<Either<DomainError, string>> {
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
    const responseConsulting = await this._repo.selectAcademicWork(academimcWorkId);

    if (responseConsulting instanceof Error) {
      return new Left(new DomainError(ErrorCategory.Persistence, "ERROR_ACADEMIC_WORK", responseConsulting.message));
    }
    if (!responseConsulting) {
      return new Left(new DomainError(ErrorCategory.Application, "ACADEMIC_WORK_NOT_FOUND", "Academic work not found"));
    }

    if (responseConsulting.academicWorkStatus === true) {
      const result = await this._repo.changeVsibility(academimcWorkId, false);
      if (result instanceof Error) {
        return new Left(new DomainError(ErrorCategory.Persistence, "ERROR_CHANGING_VISIBILITY", result.message));
      }
      return new Right("Status changed to private");
    }

    if (!this.verifyFields(responseConsulting)) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ACADEMIC_WORK_INVALID",
          "Ainda falta alguns campos obrigatórios a serem preenchidos de tornar o trabalho acadêmico visível."
        )
      );
    }

    const consultFileStorage = await this._fileStorage.checkIfDocumentExists(responseConsulting.file);

    if (!consultFileStorage) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ACADEMIC_WORK_FILE_NOT_FOUND",
          "Arquivo do trabalho acadêmico não encontrado na nuvem. Faça upload do arquivo primeiro"
        )
      );
    }
    await this._repo.changeVsibility(academimcWorkId, true);
    return new Right("Status changed to public");
  }

  verifyFields(fields: IReturnFullAcademicWorkDTO): boolean {
    return (
      fields.authors.length > 0 &&
      fields.title.length > 0 &&
      fields.year > 0 &&
      fields.qtdPag > 0 &&
      fields.description.length > 0 &&
      fields.course !== null &&
      fields.typeWork !== null &&
      fields.keyWords.length > 0 &&
      fields.ilustration !== null &&
      fields.references.length > 0 &&
      fields.cduCode !== null &&
      fields.cddCode !== null &&
      fields.cutterNumber !== null &&
      fields.advisors.length > 0
    );
  }
}
