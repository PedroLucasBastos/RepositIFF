import { TrabalhoAcademico } from "../../domain/project.js";

export interface IAcademicWorkRepository {
    registerAcademicWork(project: TrabalhoAcademico): Promise<void>;
    findByIdDoc(id: String): Promise<TrabalhoAcademico | void>;
    listAllProjects(): Promise<TrabalhoAcademico[] | void>;
}