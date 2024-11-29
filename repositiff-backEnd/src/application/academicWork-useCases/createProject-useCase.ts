import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
import { author, TrabalhoAcademico } from "@src/domain/academicWork.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { AdvisorProps } from "@src/domain/advisor.js";

type newWorkDTO = {
    authors: author[],
    // advisors: Advisor[],
    title: string,
    typeWork: string,
    year: number,
    qtdPag: number,
    description: string,
    course: string,
    keyWords: string[],
    cutterNumber?: string,
    cduCode?: string,
    cddCode?: string,
    status?: boolean,
    file?: File
}
export class CreateProjectUseCase {
    constructor(
        private academicWorkRepository: IAcademicWorkRepository,
        private academicFileStorage: IFileStorage,
        // private academicWorkSearch: IAcademicWorkSearch
    ) { }
    /*
        Esse caso de uso irá receber os valores do novo tcc e do orientador.
        Por fim deve verificar mais uma vez se o orientado se encontra já cadastrado
        Se não estiver cadastrado deve-se realizar o cadastro do mesmo
        Após estar cadastrado, 
    */
    async execute(newAcademicWorkDTO: newWorkDTO, advisor: AdvisorProps): Promise<void | Error> {
        let url = "url in useCase";
        if (newAcademicWorkDTO.file) {
            url = await this.academicFileStorage.uploadAcademicFile(newAcademicWorkDTO.file);
        }
        // console.log()
        const workProps = { ...newAcademicWorkDTO, url };
        const newWork = new TrabalhoAcademico(workProps);
        if (newWork)
            console.log(await this.academicWorkRepository.registerAcademicWork(newWork));
        else
            throw Error("Fail to create a newWork objesct");

    }
}