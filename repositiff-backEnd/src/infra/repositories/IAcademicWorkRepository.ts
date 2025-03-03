import { AcademicWork } from "../../domain/entities/academicWork.js";

export interface IAcademicWorkRepository {
    registerAcademicWork(project: AcademicWork): Promise<void>;
    findByIdDoc(id: String): Promise<AcademicWork | void>;
    listAllProjects(): Promise<AcademicWork[] | void>;
}