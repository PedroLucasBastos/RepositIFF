import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";
import { AcademicWork, academicWorkVisibility, Illustration } from "../../domain/entities/academicWork.js";
import { IAdvisorDTO } from "./IAdvisorRepository.js";
import { IReturnCourseDTO } from "./ICourse-repository.js";
import { IUpdateAcademicWorkUseCaseDTO } from "@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js";
// import { IReturnAcademicWork } from './IAcademicWorkRepository';

export interface addAcademicWorkDTO {
  idAcademicWork: string;
  authors: string[];
  idAdvisors: string[];
  title: string;
  typeWork: string;
  year: number;
  qtdPag: number;
  description: string;
  idCourse: string;
  keyWords: string[];
  ilustration: Illustration;
  references: number[];
  cutterNumber?: string;
  cduCode?: string;
  cddCode?: string;
  file?: string;
}

export interface updateAcademicWorkDTO {
  authors?: string[];
  idAdvisors?: string[];
  title?: string;
  typeWork?: string;
  year?: number;
  qtdPag?: number;
  description?: string;
  idCourse?: string;
  keyWords?: string[];
  ilustration?: string;
  references?: number[];
  cduCode?: string;
  cddCode?: string;
  file?: string;
}

export interface IReturnAcademicWorkDTO {
  id: string;
  academicWorkStatus: string;
  authors: string[];
  advisors: IAdvisorDTO[];
  course: IReturnCourseDTO;
  title: string;
  typeWork: string;
  year: number;
  qtdPag: number;
  description: string;
  keyWords: string[];
  ilustration: string;
  references: number[];
  cutterNumber: string | null;
  cduCode?: string | null;
  cddCode?: string | null;
  file: string;
}

export interface updateAcademicWorkFieldsDTO {
  id: string;
  fields: {
    authors?: string[];
    title?: string;
    typeWork?: string;
    year?: number;
    qtdPag?: number;
    description?: string;
    idCourse?: string;
    keyWords?: string[];
    ilustration?: string;
    references?: number[];
    cduCode?: string;
    cddCode?: string;
    file?: string;
  };
}

export interface updateAdvisorsDTO {
  newAdvisor: string;
}

export interface IReturnAcademicWorkUpdateFields {
  id: string;
  academicWorkVisibility: boolean;
  title: string;
  typeWork: string;
  year: number;
  qtdPag: number;
  description: string;
  keyWords: string[];
  ilustration: string;
  references: number[];
  cutterNumber: string | null;
  cduCode?: string | null;
  cddCode?: string | null;
}

export interface academicAssociativeAdvisors {
  id: string;
  advisorId: string;
  academicWorkId: string;
}

export interface IAcademicWorkRepository {
  addAcademicWork(project: addAcademicWorkDTO): Promise<Error | IReturnAcademicWorkDTO>;
  updateAcademicWork(project: updateAcademicWorkDTO, id: string): Promise<Error | IReturnAcademicWorkDTO>;
  updateAcademicWorkFields(project: updateAcademicWorkFieldsDTO): Promise<Error | IReturnAcademicWorkUpdateFields>;

  // updateAcademicWorkAdvisors(newAdvisor: string): Promise<Error | void>;
  addAdvisorToAcademicWork(academicWorkId: string, advisorId: string): Promise<Error | void>;
  deleteAdvisorToAcademicWork(academicWorkId: string, advisorId: string): Promise<Error | void>;
  listAdvisors(academicWorkId: string): Promise<Error | academicAssociativeAdvisors[]>;
  selectMainAdvisor(academicWorkId: string, advisorId: string): Promise<Error | (null | string)>;
  defineMainAdvisor(academicWorkId: string, advisorId: string): Promise<Error | void>;

  findByIdDoc(id: String): Promise<null | IReturnAcademicWorkDTO>;
  getFile(idAcademicWork: string): Promise<null | string>;
  listAllProjects(): Promise<IReturnAcademicWorkDTO[]>;
  deleteAll(): Promise<void>;
}
