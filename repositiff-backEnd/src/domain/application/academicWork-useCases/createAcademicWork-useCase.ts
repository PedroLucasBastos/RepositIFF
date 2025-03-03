import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
// import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
// import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { Author, AuthorsProps } from "@src/domain/entities/author.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";
import { IGenerateCutterNumber } from "@src/infra/cutterNumber/IGenerateCutterNumber.js";
import { Advisor } from "@src/domain/entities/advisor.js";

type newWorkDTO = {
    authors: AuthorsProps[],
    idAdvisors: string[],
    title: string,
    typeWork: string,
    year: number,
    qtdPag: number,
    description: string,
    course: string,
    keyWords: string[],
    ilustration: number[],
    references: string[],
    cduCode?: string,
    cddCode?: string,
    monograph?: File
}
export class CreateProjectUseCase {
    constructor(
        private _academicRepo: IAcademicWorkRepository,
        private _advisorRepo: IAdvisorRepository,
        private _courseRepo: ICourseRepository,
        private _fileStorage: IFileStorage,
        private _generatedCutterNumber: IGenerateCutterNumber,
        // private academicWorkSearch: IAcademicWorkSearch
    ) { }
    /*
        Esse caso de uso irá receber os valores do novo tcc e do orientador.
        Por fim deve verificar mais uma vez se o orientado se encontra já cadastrado
        Se não estiver cadastrado deve-se realizar o cadastro do mesmo
        Após estar cadastrado,
    */
    // instanciar os autores
    // buscar os orientadores
    // gerar o cutterNumber
    // fazer o updload do arquivos se houver
    // instanciar o academicWork,
    // salvar no banco de dados
    async execute(newAcademicWorkDTO: newWorkDTO): Promise<void | Error> {
        const { authors, monograph, } = newAcademicWorkDTO;
        const authorsList: Author[] = this.instantiateAuthors(authors);








        // if (monograph) {
        //     url = await this.academicFileStorage.uploadAcademicFile(monograph);
        // }
        // const workProps = { ...newAcademicWorkDTO, url };
    }

    findAdvisors(idAdvisors: string[]): Advisor[] {
        this._advisorRepo.findAdvisorById()
    }

    instantiateAuthors(authorsProps: AuthorsProps[]): Author[] {
        return authorsProps.map(author => {
            return new Author({
                registrationNumber: author.registrationNumber,
                name: author.name,
                surName: author.surName
            })
        })
    }
}