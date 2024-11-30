import { TrabalhoAcademico } from "@src/domain/entities/academicWork.js";

export class db_inMemory {
    private _db: TrabalhoAcademico[];
    constructor() {
        this._db = []
    }

    // Adiciona um novo trabalho acadêmico ao "banco de dados"
    add(work: TrabalhoAcademico): void {
        this._db.push(work);
    }

    // Retorna todos os trabalhos acadêmicos
    getAll(): TrabalhoAcademico[] {
        return this._db;
    }

    // Busca por ID
    // getById(id: String): AcademicWork | undefined {
    //     return this.data.find(work => work["_id"] === id); // Considerando que "_id" é privado
    // }
}