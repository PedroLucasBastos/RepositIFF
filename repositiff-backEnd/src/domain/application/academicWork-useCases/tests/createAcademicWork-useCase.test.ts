
import { CreateProjectUseCase, CreateProjectUseCaseDTO } from "@src/domain/application/academicWork-useCases/createAcademicWork-useCase.js";
import { describe, it, expect } from "vitest";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { DependeciesAcademicTest } from "./dependenciesAcademicTests.js";
import { PrismaAcademicWorkRepository } from "@src/infra/repositories/prisma/prisma-academicWork-repository.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { CloudFlareFileStorage } from "@src/infra/fileStorage/cloudFlare-fileStorage.js";
import fs from "fs/promises";
import path from "path";
+
    describe("Executing a useCase to create and regist a academicWork", async () => {
        const repo = new PrismaAcademicWorkRepository();
        const courseRepo = new PrismaCourseRepostory();
        const advisorRepo = new PrismaAdvisorRepository();
        it("Clear tables", async () => {
            await repo.deleteAll();
        })

        it("It must be able to correctly execute the use case, related to the registration of an academic work, missing the file url and literary codes", async () => {
            const { advisor, course } = await DependeciesAcademicTest.allCorrectly();

            const fileBuffer = await fs.readFile(path.join(__dirname,
                "../../../infra/fileStorage/tests/",
                "teste1.pdf"
            ));

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
                file: fileBuffer
            }


            const cloudFlare = new CloudFlareFileStorage();

            const sup = new CreateProjectUseCase(repo, advisorRepo, courseRepo, cloudFlare);
            console.log('CADASTRO DE TRABALHO ACADÉMICO\n');
            const resultUseCase = await sup.execute(info);
            expect(resultUseCase.isRight()).toBeTruthy();
            if (resultUseCase.isRight()) {
                const academicWork = resultUseCase.value;
                // console.log(`Key: ${academicWork.file?.key}`);

                const resultDownload = await cloudFlare.download(academicWork.file || "");
                console.log('\n\nLINK PARA DOWNLOAD')
                console.log(resultDownload);
            }
            // await repo.deleteAll();
            // const sup = new CreateProjectUseCase(inMemoryRepo, inMemoryStorage);

            // console.log("Advisor")
            // console.log(await advisorRepo.findAdvisorById(advisor.id));
            // // console.log(advisor)
            // console.log("\n")
            // console.log("Course")
            // console.log(await courseRepo.findCourseById(course.id));
            // console.log(course)

            // const existingAdvisors = await advisorRepo.findMany({
            //     where: { id: { in: project.idAdvisors } }, // Filtra apenas IDs existentes
            //     select: { id: true } // Retorna apenas os IDs encontrados
            // });

            // const existingAdvisorIds = existingAdvisors.map(advisor => advisor.id);

            // console.log("Advisors encontrados no banco:", existingAdvisorIds);

            // console.log(info);

            // console.log(result);




        })
        // it("Clear tables", async () => {
        //     advisorRepo.deleteAdvisor(advisor.id);
        //     courseRepo.deleteCourse(course.id);

        // })
    });