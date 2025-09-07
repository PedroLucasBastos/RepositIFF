import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Left } from "@src/error_handling/either.Funcional.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export class DeleteAcademicWorkUseCase {
  constructor(
    private _academicRepo: IAcademicWorkRepository,
    private _fileStorage: IFileStorage,
    private userRole: string
  ) {}

  async execute(id: string, userRole: string): Promise<void | Error> {
    if (userRole !== Role.LIBRARIAN) {
      return new Error("Permission denied");
    }
    const fileName = await this._academicRepo.getFile(id);

    if (!fileName) return new Error("asdçfjasdklfj");

    this._fileStorage.delete(fileName);
    this._academicRepo.deleteAcademicWork(id);
  }
}
