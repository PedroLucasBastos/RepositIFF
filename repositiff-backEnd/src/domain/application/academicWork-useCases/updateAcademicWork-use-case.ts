import { AcademicWork } from "@prisma/client";
import { AcademicWorkValitador } from "@src/domain/entities/validators/academicWorkFValidate.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left } from "@src/error_handling/either.Funcional.js";
import { Right } from "@src/error_handling/either.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository, IReturnAcademicWorkDTO } from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface IUpdateAcademicWorkUseCaseDTO {
    authors?: string[],
    idAdvisors?: string[],
    title?: string,
    typeWork?: string,
    year?: number,
    qtdPag?: number,
    description?: string,
    idCourse?: string,
    keyWords?: string[],
    ilustration?: string,
    references?: number[],
    cduCode?: string,
    cddCode?: string,
    file?: Buffer
}

export class UpdateAcademicWork_useCase {

    constructor(
        private _repo: IAcademicWorkRepository,
        private _storage: IFileStorage
    ) { }

    async execute(props: IUpdateAcademicWorkUseCaseDTO, id: string): Promise<Either<DomainError, IReturnAcademicWorkDTO>> {

        const validateResult = AcademicWorkValitador.validateUpdatedProps(props)
        if (validateResult.isLeft())
            return new Left(validateResult.value);

        console.log("Props")
        console.log(props)
        const resultUpdated = await this._repo.updateAcademicWork({
            authors: props.authors,
            description: props.description,
            cddCode: props.cddCode,
            cduCode: props.cduCode,
            references: props.references,
            title: props.title,
            idAdvisors: props.idAdvisors,
            idCourse: props.idCourse,
            keyWords: props.keyWords,
            qtdPag: props.qtdPag,
            typeWork: props.typeWork,
            year: props.year,
            ilustration: props.ilustration,
        }, id);
        if (resultUpdated instanceof Error) {
            return new Left(new DomainError(
                ErrorCategory.Application,
                "Error to updated academicWork",
                resultUpdated.message
            ))
        }
        if (props.file) {
            await this._storage.upload(
                resultUpdated.file,
                props.file
            );
        }
        return new Right(resultUpdated);


    }


    // private MODELO-ANTIGO() {
    //     const validateResult = AcademicWorkValitador.validateUpdatedProps(props)
    //     if (validateResult.isLeft())
    //         return new Left(validateResult.value);

    //     console.log("Props")
    //     console.log(props)
    //     const resultUpdated = await this._repo.updateAcademicWork({
    //         authors: props.authors,
    //         description: props.description,
    //         cddCode: props.cddCode,
    //         cduCode: props.cduCode,
    //         references: props.references,
    //         title: props.title,
    //         idAdvisors: props.idAdvisors,
    //         idCourse: props.idCourse,
    //         keyWords: props.keyWords,
    //         qtdPag: props.qtdPag,
    //         typeWork: props.typeWork,
    //         year: props.year,
    //         ilustration: props.ilustration,
    //     }, id);
    //     if (resultUpdated instanceof Error) {
    //         return new Left(new DomainError(
    //             ErrorCategory.Application,
    //             "Error to updated academicWork",
    //             resultUpdated.message
    //         ))
    //     }
    //     if (props.file) {
    //         await this._storage.upload(
    //             resultUpdated.file,
    //             props.file
    //         );
    //     }
    //     return new Right(resultUpdated);

    // }



    // private verifyProps(props: IUpdateAcademicWorkUseCaseDTO): Either<String, IUpdateAcademicWorkUseCaseDTO> {
    //     let errorList = [];
    //     let validProps: IUpdateAcademicWorkUseCaseDTO;
    //     if (props.authors && AcademicWorkValitador.) {
    //     }

    // }

}