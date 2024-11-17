
import { CreateProjectUseCase } from "@src/application/academicWork-useCases/createProject-useCase.js";
import {describe, it, expect} from "vitest";
import { Project_InMemory_Repository } from "../../test/inMemory/project-inMemory-repository.js";
import { fileStorageFake } from "../../test/inMemory/fileStorageFake.js";
describe("Executing a useCase to create and regist a academicWork",()=>{
    it("It must be able to correctly execute the use case, related to the registration of an academic work, missing the file url and literary codes",async ()=>{
        const fileContent = 'This is a test file content';
        const file = new File([ ], 'test-file.txt', { type: 'text/plain' });
        const info = {
            // id: "123abc890",
            // createdAt: "29/02",
            authors: [
                { nome: "Michael Johnson-useCase1", sobrenome: "Emily Davis-useCase1" },
                { nome: "Beltrano-useCase1", sobrenome: "De Souza-useCase1" },
            ],
            advisors: [
                { nome: "Dr. Sophia Martinez-useCase1", sobrenome: "Prof. Charlie Williams-useCase1" },
            ],
            title: "Análise de Dados em Grandes Corporações",
            typeWork: "Dissertação de Mestrado",
            year: 2023,
            qtdPag: 150,
            description: "Este trabalho aborda a análise de grandes volumes de dados em corporações multinacionais, utilizando técnicas avançadas de estatística e aprendizado de máquina.",
            course: "Ciência de Dados",
            keyWords: ["Big Data", "Análise de Dados", "Aprendizado de Máquina", "Estatística Avançada"],
            status: true,
            cddCode: "123abc",
            file: file
        }
        const inMemoryRepo = new Project_InMemory_Repository();
        const inMemoryStorage = new fileStorageFake();
        const sup = new CreateProjectUseCase(inMemoryRepo,inMemoryStorage);

        sup.execute(info);

        const register = await inMemoryRepo.listAllProjects();
        console.log(register);
    })

    
});