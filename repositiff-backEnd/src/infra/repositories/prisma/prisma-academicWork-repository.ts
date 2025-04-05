import { academicWorkVisibility, AcademicWork } from "@src/domain/entities/academicWork.js";
import { addAcademicWorkDTO, IAcademicWorkRepository, IReturnAcademicWorkDTO } from "@src/infra/repositories/IAcademicWorkRepository.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { Author } from '@src/domain/entities/author.js';
import { AdvisorFactory } from "@src/domain/entities/factories/advisorFactory.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Advisor } from '@src/domain/entities/advisor.js';
import { IReturnCourseDTO } from "../ICourse-repository.js";
import { IReturnAdvisorDTO } from "../IAdvisorRepository.js";
import { MapperAcademicWork } from '@src/mappers/mapperAcademicWork.js';


const prismaErrorMessages: Record<string, string> = {
    P2002: "Duplicate value for unique field(s) - PRISMA ERROR CODE P2002",
    P2003: 'Foreign key constraint failed - PRISMA ERROR CODE P2003',
    P2000: 'Value is too long for a column - PRISMA ERROR CODE P2000',
    P2025: 'Record not found - PRISMA ERROR CODE P2025',
    P2006: 'Invalid data for a column - PRISMA ERROR CODE P2006',
    P2016: 'Invalid connection to the database - PRISMA ERROR CODE P2016',
};

export class PrismaAcademicWorkRepository implements IAcademicWorkRepository {
    private _prismaCli: PrismaClient;
    constructor() {
        this._prismaCli = new PrismaClient();
    }
    async getFile(idAcademicWork: string): Promise<null | string> {
        try {
            // console.log("Começo do try")
            const prismaAcademicWork = await this._prismaCli.academicWork.findUnique({
                select: {
                    file: true
                },
                where: {
                    id: idAcademicWork,
                },

            });
            return prismaAcademicWork?.file ?? null;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                console.log(error);
                throw new Error(customMessage);

            }
            return null;
        }
    }
    async addAcademicWork(project: addAcademicWorkDTO): Promise<Error | IReturnAcademicWorkDTO> {
        // console.log(project.idAdvisors)
        // console.log(project.idCourse)
        console.log("Entrou no addAcademicWork");
        console.log(project);
        try {
            const prismaData = await this._prismaCli.academicWork.create({
                data: {
                    id: project.idAcademicWork, // Pegando o id_doc do objeto project
                    title: project.title, // Título do trabalho
                    typeWork: project.typeWork, // Tipo de trabalho
                    year: project.year, // Ano do trabalho
                    qtdPag: project.qtdPag, // Quantidade de páginas
                    description: project.description, // Descrição do trabalho
                    keyWords: project.keyWords, // Palavras-chave
                    academicWorkStatus: project.academicWorkStatus,
                    ilustration: project.ilustration,
                    references: project.references,
                    authors: project.authors,

                    // Campos opcionais, se houver
                    cutterNumber: project.cutterNumber ?? null, // Pode ser null se não houver
                    cduCode: project.cduCode ?? null,
                    cddCode: project.cddCode ?? null,
                    file: project.file,
                    course: {
                        connect: {
                            id: project.idCourse
                        }
                    },
                    advisors: {
                        create: project.idAdvisors.map(advisorId => ({
                            Advisor: { connect: { id: advisorId } } // Conectando advisor existente
                        }))
                    },
                },
                include: {
                    advisors: {
                        select: {
                            Advisor: true

                        }
                    },
                    course: true  // Inclui todos os orientadores associados ao trabalho acadêmico
                },
            })
            // console.log(prismaData);
            // console.log(prismaData.advisors[0].Advisor);

            // const courseDTO: IReturnCourseDTO = {
            //     id: prismaData.courseId,
            //     degreeType: prismaData.course.degreeType,
            //     name: prismaData.course.name,
            //     courseCode: prismaData.course.courseCode,
            // }

            // const advisorDTO: IReturnAdvisorDTO[] = prismaData.advisors.map(advisor => ({
            //     id: advisor.id,
            //     name: advisor.Advisor.name,
            //     surname: advisor.Advisor.surname,
            //     registrationNumber: advisor.Advisor.registrationNumber
            // }))

            // const dto: IReturnAcademicWorkDTO = {
            //     id: prismaData.id,
            //     academicWorkStatus: prismaData.academicWorkStatus,
            //     authors: prismaData.authors,
            //     advisors: advisorDTO,
            //     course: courseDTO,
            //     title: prismaData.title,
            //     typeWork: prismaData.typeWork,
            //     year: prismaData.year,
            //     qtdPag: prismaData.qtdPag,
            //     description: prismaData.description,
            //     keyWords: prismaData.keyWords,
            //     ilustration: prismaData.ilustration,
            //     references: prismaData.references,
            //     cutterNumber: prismaData.cutterNumber,
            //     cduCode: prismaData.cduCode,
            //     cddCode: prismaData.cddCode,
            // }
            // console.log("Academic Work successfully registered!");
            // console.log(`ID SALVO NO BANCO DE DADOS ${prismaData.id}`)
            // console.log(prismaData);
            // console.log("=========================================================")
            return MapperAcademicWork.toDTO(prismaData);
        } catch (error) {
            // console.log("\n\n\n")
            // console.log("teste: ", error);
            // console.log("\n\n\n")
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || `Unknown database error occurred - CODE:${error.code}`;
                console.log(customMessage);
                console.log(error);
                return new Error(customMessage, error);
            }
            return new Error("Unexpected Error to database");
        }
    }
    async findByIdDoc(id: string): Promise<null | IReturnAcademicWorkDTO> {
        console.log(`Está buscando id: ${id}`)
        try {
            // console.log("Começo do try")
            const prismaAcademicWork = await this._prismaCli.academicWork.findUnique({
                where: {
                    id: id,
                },
                include: {
                    advisors: {
                        select: {
                            Advisor: true

                        }
                    },
                    course: true  // Inclui todos os orientadores associados ao trabalho acadêmico
                },
            });
            // const academicWork = this.mapperAcademicWork(prismaAcademicWork);
            if (!prismaAcademicWork)
                return (null);
            // const result = this.mapperAcademicWork(prismaAcademicWork);
            // if (result instanceof Error) {
            //     console.log("Unexpected error");
            //     console.log(prismaAcademicWork);
            //     throw new Error("Information incompatible with the database and business rules ", result);
            // }
            // return result as AcademicWork;
            return MapperAcademicWork.toDTO(prismaAcademicWork);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
        }
        throw new Error("Unexpected error");
    }
    async listAllProjects(): Promise<IReturnAcademicWorkDTO[]> {
        try {
            console.log("antes da consulta")
            const listPrismaAcademicWork = await this._prismaCli.academicWork.findMany({
                include: {
                    advisors: {
                        select: {
                            Advisor: true

                        }
                    },
                    course: true  // Inclui todos os orientadores associados ao trabalho acadêmico
                },
            });
            console.log("depois da consulta");
            // console.log(listPrismaAcademicWork)
            // const listAcademicWork = listPrismaAcademicWork.map((prismaAcademicWork) => {
            //     return this.mapperAcademicWork(prismaAcademicWork)
            // });
            // const hasError = listAcademicWork.some((result) => result instanceof Error);
            // if (hasError) {
            //     console.log("Unexpected error");
            //     console.log(listAcademicWork);
            //     throw new Error("Information incompatible with the database and business rules");
            // }
            // return listAcademicWork as AcademicWork[];
            const asdf = listPrismaAcademicWork.map((data) => {
                return MapperAcademicWork.toDTO(data)
            })
            console.log("depois da executar")
            // console.log(listPrismaAcademicWork.map((data) => {
            //     return MapperAcademicWork.toDTO(data)
            // }))
            return listPrismaAcademicWork.map((data) => {
                return MapperAcademicWork.toDTO(data)
            })
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                // The .code property can be accessed in a type-safe manner
                const customMessage = prismaErrorMessages[error.code] || 'Unknown database error occurred';
                console.log(customMessage);
                throw new Error(customMessage);
            }
            console.log(error)
            throw new Error("Unexpected Error to database");
        }
    }

    async deleteAll(): Promise<void> {
        await this._prismaCli.$executeRawUnsafe(`
            TRUNCATE TABLE 
                "Advisor_AcademicWork", 
                "AcademicWork", 
                "Advisor", 
                "Course", 
                "Librarian"
            RESTART IDENTITY CASCADE;
        `);
    }
    private mapperAcademicWork(prismaData: any): Error | AcademicWork {
        const advisorErrorsMapping: {
            advisorId: string,
            Error: Error
        }[] = [];

        console.log(prismaData);

        const advisorMapped: Advisor[] = prismaData.advisor.map((advisor: any) => {
            const advisorOrError = AdvisorFactory.createAdvisor({
                name: advisor.name,
                surname: advisor.surname,
                registrationNumber: advisor.registrationNumber,
            },
                advisor.id
            );
            if (advisorOrError instanceof DomainError)
                advisorErrorsMapping.push({
                    advisorId: advisor.id,
                    Error: advisorOrError
                });
            else
                return advisorOrError;
        });

        if (advisorErrorsMapping.length > 0)
            return Error("ERROR_TO_MAPPING_ADVISOR", { cause: advisorErrorsMapping });

        const academicWorkCreated = AcademicWork.createAcademicWorkFactory(
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
                file: prismaData.file,
                authors: prismaData.authors,
                advisors: advisorMapped,
                illustration: prismaData.illustration,
                references: prismaData.references
            },
            prismaData.id,
            prismaData.academicWorkStatus,

        );
        if (academicWorkCreated.isLeft())
            throw new Error("ERROR_TO_MAPPING_ACADEMICWORK_VALUES", { cause: academicWorkCreated })
        return academicWorkCreated.value;
    }
    // private mapperAcademicWork(prismaData: any): AcademicWork {
    //     return new AcademicWork(
    //         {
    //             title: prismaData.title,
    //             typeWork: prismaData.typeWork,
    //             year: prismaData.year,
    //             qtdPag: prismaData.qtdPag,
    //             description: prismaData.description,
    //             course: prismaData.course,
    //             keyWords: prismaData.keyWords,
    //             cutterNumber: prismaData.cutterNumber,
    //             cduCode: prismaData.cduCode,
    //             cddCode: prismaData.cddCode,
    //             url: prismaData.url,
    //             authors: prismaData.authors.map((author: Author) => (author.nome, author.sobrenome)),
    //             advisors: prismaData.advisors.map((advisor: Advisor) => (advisor.nome, advisor.sobrenome))
    //         },
    //         id: prismaData.id,
    //         academicWorkStatusParams: prismaData.academicWorkStatus,
    //     );
    // }




}