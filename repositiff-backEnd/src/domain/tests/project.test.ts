import { describe, it, expect } from "vitest";
describe("Create project object", () => {
    it("Should be able to instantiate the entity Project ", () => {
        const tudoCerto = {
            authors: [
                { nome: "John Doe", sobrenome: "Jane Smith" },
                { nome: "Fulano", sobrenome: "Da Silva" },
            ],
            advisors: [
                { nome: "Dr. Alice Johnson", sobrenome: "Prof. Bob Brown" },
            ],
            title: "Análise de Dados em Grandes Corporações",
            typeWork: "Dissertação de Mestrado",
            year: 2023,
            qtdPag: 150,
            description: "Este trabalho aborda a análise de grandes volumes de dados em corporações multinacionais, utilizando técnicas avançadas de estatística e aprendizado de máquina.",
            course: "Ciência de Dados",
            keyWords: ["Big Data", "Análise de Dados", "Aprendizado de Máquina", "Estatística Avançada"],
            url: "https://www.universityexample.com/thesis/12345",
            cutterNumber: "E321N",
            cduCode: "cdu312",
            cddCode: "cdd312",
            // status:true
        };

    })


})