import { TrabalhoAcademico } from "@src/domain/project.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js"
import { db_inMemory } from "@src/test/inMemory/db_inMemory.js"
export class Project_InMemory_Repository implements IAcademicWorkRepository {
    private _db: db_inMemory;
    constructor() {
        this._db = new db_inMemory();
    }
    findByIdDoc(id: String): Promise<TrabalhoAcademico> {
        throw new Error("Method not implemented.");
    }
    registerAcademicWork(project: TrabalhoAcademico): Promise<void> {
        this._db.add(project);
        return Promise.resolve();
    }

    listAllProjects(): Promise<TrabalhoAcademico[]> {
        return Promise.resolve(this._db.getAll());
    }
}