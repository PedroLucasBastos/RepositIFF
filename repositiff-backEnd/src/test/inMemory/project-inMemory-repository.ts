import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js"
import { db_inMemory } from "@src/test/inMemory/db_inMemory.js"
export class Project_InMemory_Repository implements IAcademicWorkRepository {
    private _db: db_inMemory;
    constructor() {
        this._db = new db_inMemory();
    }
    findByIdDoc(id: String): Promise<AcademicWork> {
        throw new Error("Method not implemented.");
    }
    addAcademicWork(project: AcademicWork): Promise<void> {
        this._db.add(project);
        return Promise.resolve();
    }

    listAllProjects(): Promise<AcademicWork[]> {
        return Promise.resolve(this._db.getAll());
    }
}