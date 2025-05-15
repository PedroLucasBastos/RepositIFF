import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";
import { AcademicWork, academicWorkVisibility, Illustration } from "../../domain/entities/academicWork.js";
import { IReturnAdvisorDTO } from "./IAdvisorRepository.js";
import { IReturnCourseDTO } from "./ICourse-repository.js";
import { IUpdateAcademicWorkUseCaseDTO } from "@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js";

export interface addAcademicWorkDTO {
    idAcademicWork: string,
    academicWorkStatus: academicWorkVisibility,
    authors: string[],
    idAdvisors: string[],
    title: string,
    typeWork: string,
    year: number,
    qtdPag: number,
    description: string,
    idCourse: string,
    keyWords: string[],
    ilustration: Illustration,
    references: number[],
    cutterNumber?: string,
    cduCode?: string,
    cddCode?: string,
    file?: string
}

export interface updateAcademicWorkDTO {
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
    file?: string
}

export interface IReturnAcademicWorkDTO {
    id: string,
    academicWorkStatus: string,
    authors: string[],
    advisors: IReturnAdvisorDTO[],
    course: IReturnCourseDTO,
    title: string,
    typeWork: string,
    year: number,
    qtdPag: number,
    description: string,
    keyWords: string[],
    ilustration: string,
    references: number[],
    cutterNumber: string | null,
    cduCode?: string | null,
    cddCode?: string | null,
    file: string,
}

export interface IAcademicWorkRepository {
    addAcademicWork(project: addAcademicWorkDTO): Promise<Error | IReturnAcademicWorkDTO>;
    updateAcademicWork(project: updateAcademicWorkDTO, id: string): Promise<Error | IReturnAcademicWorkDTO>;
    findByIdDoc(id: String): Promise<null | IReturnAcademicWorkDTO>;
    getFile(idAcademicWork: string): Promise<null | string>;
    listAllProjects(): Promise<IReturnAcademicWorkDTO[]>;
    deleteAll(): Promise<void>
}