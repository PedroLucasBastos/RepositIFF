import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.Funcional.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";


export class DownloadFileUseCase {
    constructor(
        private _repo: IAcademicWorkRepository,
        private _fileStorage: IFileStorage,
    ) { }

    async execute(idDoc: string): Promise<Either<DomainError, string>> {
        const idFile = await this._repo.getFile(idDoc);
        console.log(`idDoc: ${idDoc}`)
        console.log(`idFile: ${idFile}`)
        if (!idFile)
            return new Left(new DomainError(
                ErrorCategory.Application,
                "FILE ID NOT FOUND",
                "The file not up to file storage or the id doc not include in database"))
        const link = await this._fileStorage.download(idFile);
        console.log(link)
        if (link instanceof Error)
            return new Left(new DomainError(
                ErrorCategory.Application,
                "FILE NOT FOUND",
                "The file not up to file storage or the id doc not include in database"))
        return new Right(link);
    }
}