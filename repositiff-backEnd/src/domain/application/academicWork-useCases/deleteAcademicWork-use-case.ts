import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export class DeleteAcademicWorkUseCase {
  constructor(
    private _academicRepo: IAcademicWorkRepository,
    private _fileStorage: IFileStorage
  ) {}

  async execute(id: string): Promise<void | Error> {
    const fileName = await this._academicRepo.getFile(id);

    if (!fileName) return new Error("asdçfjasdklfj");

    this._fileStorage.delete(fileName);
    this._academicRepo.deleteAcademicWork(id);
  }
}
