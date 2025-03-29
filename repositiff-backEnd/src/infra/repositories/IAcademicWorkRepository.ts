import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";
import { AcademicWork, academicWorkVisibility, Illustration } from "../../domain/entities/academicWork.js";
import { IReturnAdvisorDTO } from "./IAdvisorRepository.js";
import { IReturnCourseDTO } from "./ICourse-repository.js";

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
    file?: AcademicWorkFile
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
    file?: string | null,
}

export interface IAcademicWorkRepository {
    addAcademicWork(project: addAcademicWorkDTO): Promise<Error | IReturnAcademicWorkDTO>;
    findByIdDoc(id: String): Promise<null | AcademicWork>;
    listAllProjects(): Promise<IReturnAcademicWorkDTO[]>;
    deleteAll(): Promise<void>
}