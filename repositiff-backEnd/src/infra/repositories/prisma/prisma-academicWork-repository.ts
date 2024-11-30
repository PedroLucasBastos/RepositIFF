import { academicWorkStatus, TrabalhoAcademico } from "@src/domain/entities/academicWork.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
import { Advisor, Author, PrismaClient } from "@prisma/client";

export class academicPrismaRepository implements IAcademicWorkRepository {
    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }
    async registerAcademicWork(project: TrabalhoAcademico): Promise<void> {
        try {
            const academicRegisted = await this._prismaCli.academicWork.create({
                data: {
                    id: project.getId(), // Pegando o id_doc do objeto project
                    title: project.getTitle(), // Título do trabalho
                    typeWork: project.getTypeWork(), // Tipo de trabalho
                    year: project.getYear(), // Ano do trabalho
                    qtdPag: project.getQtdPag(), // Quantidade de páginas
                    description: project.getDescription(), // Descrição do trabalho
                    course: project.getCourse(), // Curso relacionado ao trabalho
                    keyWords: project.getKeyWords(), // Palavras-chave

                    // Campos opcionais, se houver
                    cutterNumber: project.getCutterNumber(), // Pode ser null se não houver
                    cduCode: project.getCduCode(),
                    cddCode: project.getCddCode(),
                    url: project.getUrl(),
                    status: project.getStatus(), // Status padrão como true

                    // Relacionamentos com autores e orientadores
                    authors: {
                        create: project.getAuthors().map((author) => ({
                            nome: author.nome,
                            sobrenome: author.sobrenome,
                        }))
                    },
                    advisors: {
                        create: project.getAdvisors().map(advisor => ({
                            nome: advisor.nome,
                            sobrenome: advisor.sobrenome,
                        }))
                    },
                }
            })
            console.log("Academic Work successfully registered!");
        } catch (error) {
            console.error("Error details: ", error); // Adicione essa linha para imprimir o erro específico
            console.log("Academic Work failed to registered!");
            return Promise.reject();
        }
    }

    async findByIdDoc(id: string): Promise<TrabalhoAcademico | void> {
        console.log(`Está buscando id: ${id}`)
        try {
            console.log("Começo do try")
            const prismaAcademicWork = await this._prismaCli.academicWork.findUnique({
                where: {
                    id: id,
                }
            });
            const academicWork = this.mapperAcademicWork(prismaAcademicWork);
            if (academicWork) {
                return academicWork;
            }
        } catch (error) {
            console.error("Error details: ", error);
            throw new Error("Erro ao buscar o trabalho acadêmico.");
        }
        console.log('Não foi nenhum')
    }
    async listAllProjects(): Promise<TrabalhoAcademico[] | void> {
        try {
            const listPrismaAcademicWork = await this._prismaCli.academicWork.findMany();
            const listAcademicWork = listPrismaAcademicWork.map((prismaAcademicWork) => (this.mapperAcademicWork(prismaAcademicWork)));
            return listAcademicWork;
        } catch (error) {

        }
    }
    private mapperAcademicWork(prismaData: any): TrabalhoAcademico {
        return new TrabalhoAcademico(
            {
                title: prismaData.title,
                typeWork: prismaData.typeWork,
                year: prismaData.year,
                qtdPag: prismaData.qtdPag,
                description: prismaData.description,
                course: prismaData.course,
                keyWords: prismaData.keyWords,
                cutterNumber: prismaData.cutterNumber,
                cduCode: prismaData.cduCode,
                cddCode: prismaData.cddCode,
                url: prismaData.url,
                authors: prismaData.authors.map((author: Author) => (author.nome, author.sobrenome)),
                advisors: prismaData.advisors.map((advisor: Advisor) => (advisor.nome, advisor.sobrenome))
            },
            id: prismaData.id,
            academicWorkStatusParams: prismaData.academicWorkStatus,
        );
    }

}