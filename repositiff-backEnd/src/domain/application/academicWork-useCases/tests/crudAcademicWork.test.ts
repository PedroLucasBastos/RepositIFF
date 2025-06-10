
import { CreateProjectUseCase, CreateProjectUseCaseDTO } from "@src/domain/application/academicWork-useCases/createAcademicWork-useCase.js";
import { describe, it, expect } from "vitest";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { DependeciesAcademicTest } from "./dependenciesAcademicTests.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { CloudFlareFileStorage } from "@src/infra/fileStorage/cloudFlare-fileStorage.js";
import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { UpdateAcademicWorkBasicInfoUseCase } from "../UpdateAcademicWorkBasicInfoUse_case.js";

describe("asdfsadfasdf", async () => {
    const repo = new PrismaAcademicWorkRepository();
    const courseRepo = new PrismaCourseRepostory();
    const advisorRepo = new PrismaAdvisorRepository();

    it("Clear tables", async () => {
        await repo.deleteAll();
    })

    it("asdfasdfsadfasdfasdfsdf", async () => {
        const { advisor, course } = await DependeciesAcademicTest.allCorrectly();

        // const fileBuffer = await fs.readFile(path.join(__dirname,
        //     "../../../infra/fileStorage/tests/",
        //     "teste1.pdf"
        // ));

        const info: CreateProjectUseCaseDTO = {
            authors: [
                "Michael Johnson-useCase1",
                "Beltrano-useCase1"
            ],
            idAdvisors: [
                advisor.id
            ],
            title: "Análise de Dados em Grandes Corporações",
            typeWork: "Undergraduate thesis",
            idCourse: course.id,
            year: 2023,
            qtdPag: 150,
            description: "Este trabalho aborda a análise de grandes volumes de dados em corporações multinacionais, utilizando técnicas avançadas de estatística e aprendizado de máquina.",
            keyWords: ["Big Data", "Análise de Dados", "Aprendizado de Máquina", "Estatística Avançada"],
            cddCode: "123abc",
            ilustration: "Colorful",
            references: [1, 22, 55, 66, 99],
        }

        const cloudFlare = new CloudFlareFileStorage();

        const addAcademicWork = new CreateProjectUseCase(repo, advisorRepo, courseRepo, cloudFlare);
        console.log('CADASTRO DE TRABALHO ACADÉMICO\n');
        const resultUseCase = await addAcademicWork.execute(info);
        expect(resultUseCase.isRight()).toBeTruthy();
        const academicWork = resultUseCase.value as AcademicWork;

        const newParams = {
            title: "TITULO DE DEMONSTRAÇÃO, VEGETTI FEZ GOL CONTRA"
        }

        const sup = new UpdateAcademicWorkBasicInfoUseCase(repo);

        const params = {
            id: academicWork.id,
            fields: newParams
        }

        const result = await sup.execute(params);
        expect(result.isRight()).toBeTruthy();
        console.log(result.value);
    })
});