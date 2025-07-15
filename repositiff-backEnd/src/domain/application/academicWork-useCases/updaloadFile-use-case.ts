import { Right } from "@src/error_handling/either.Funcional.js";
import { EitherOO } from "@src/error_handling/either.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

interface IUpdateFielProps {
  id: string;
  file: Buffer;
}

export class UploadFileUseCase {
  constructor(
    private _academicRepo: IAcademicWorkRepository,
    private _fileStorage: IFileStorage
  ) {}

  async execute(props: any): Promise<EitherOO<Error, void>> {
    return new Right(undefined);
  }
}
