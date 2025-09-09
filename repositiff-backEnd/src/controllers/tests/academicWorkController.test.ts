import { DependeciesAcademicTest } from "@src/domain/application/academicWork-useCases/tests/dependenciesAcademicTests.js";
import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { describe, expect, it } from "vitest";

import { Blob } from "fetch-blob";
import { File, FormData } from "formdata-node";
import fs from "fs/promises";
import path from "path";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { CutterTable } from "@src/domain/services/cutterNumber.js";
import { listenerCount } from "process";

describe("", async () => {
  const repoAdvisor = new PrismaAdvisorRepository();
  const repoCourse = new PrismaCourseRepostory();
  await repoAdvisor.deleteAll();
  // await repoCourse.deleteAll();
  // it("Clear tables", async () => {

  // });
  const { advisor: advisorCorrectly, course: courseCorrectly } = await DependeciesAcademicTest.allCorrectly();
  const aditionalCourse = await DependeciesAcademicTest.aditionalCourse();
  const advisorAditional = await DependeciesAcademicTest.aditionalAdvisor();

  it("should be able to register a academicWork in a routes", async () => {
    // const fileBuffer = await fs.readFile(path.join(__dirname, "./", "teste1.pdf"));
    // const buffer = await fs.readFile(path.join(__dirname, "teste1.pdf"));
    // const file = new File([buffer], "teste2.pdf");
    // const formData = new FormData();
    // console.log("Tamanho do buffer:", buffer.length); // deve ser > 0
    // formData.append("authors", JSON.stringify(["Casimiro de Anchieta", "Beatriz Camargo"]));
    // formData.append("idAdvisors", JSON.stringify([advisorCorrectly.id]));
    // formData.append("title", "Análise crítica do filme Bastardos Inglórios");
    // formData.append("typeWork", "Undergraduate thesis");
    // formData.append("idCourse", courseCorrectly.id);
    // formData.append("year", "2023");
    // formData.append("qtdPag", "150");
    // formData.append("description", "Este trabalho aborda a análise da forma de pensar do Tarantino");
    // formData.append("keyWords", JSON.stringify(["Tarantino", "Quientin", "Bastardos", "Gularme"]));
    // formData.append("cddCode", "794.8");
    // formData.append("ilustration", "Colorful");
    // formData.append("references", JSON.stringify([1, 22, 55, 66, 99]));
    // formData.append("file", file); // ✅ agora sim um File real
    // console.log(formData);
    // const response = await fetch("http://localhost:3333/academicWork/create", {
    //   method: "POST",
    //   body: formData,
    // });
    // expect(response.status).toBe(201);
    // console.log(response.body);
  });

  it("should be able to add advisor in academicWork on the routes", async () => {
    // const buffer = await fs.readFile(path.join(__dirname, "teste2.pdf"));
    // const file = new File([buffer], "teste2.pdf", { type: "application/pdf" });
    // const formData = new FormData();
    // formData.append("authors", JSON.stringify(["Felizberto Moreira", "Amanda Nudes"]));
    // formData.append("idAdvisors", JSON.stringify([advisorCorrectly.id]));
    // formData.append("title", "Além da Morte: Como Dark Souls Representa os Desafios e Superações da Vida Real");
    // formData.append("typeWork", "Undergraduate thesis");
    // formData.append("idCourse", courseCorrectly.id);
    // formData.append("year", "2023");
    // formData.append("qtdPag", "120");
    // formData.append("description", "Este trabalho analisa o jogo Dark Souls como uma metáfora existencial, explorando como suas mecânicas, ambientação e narrativa representam conceitos como resiliência, fracasso, aprendizado e persistência frente às adversidades do cotidiano.");
    // formData.append("keyWords", JSON.stringify(["Dark Souls", "Filosofia dos Jogos", "Superação", "Resiliência", "Experiência do Jogador"]));
    // formData.append("cddCode", "794.8");
    // formData.append("ilustration", "Colorful");
    // formData.append("references", JSON.stringify([1, 22, 55, 66, 99]));
    // formData.append("file", file);
    // console.log(formData);
    // const responseAddAcademicWork = await fetch("http://localhost:3333/academicWork/create", {
    //   method: "POST",
    //   body: formData,
    // });
    // console.log(responseAddAcademicWork.body);
    // expect(responseAddAcademicWork.status).toBe(201);
    // // console.log(responseAddAcademicWork.json());
    // // console.log("DPS de mandar");
    // const value: any = await responseAddAcademicWork.json();
    // const idAcademicWork = value.Data._id;
    // console.log("Id:", idAcademicWork);
    // const response = await fetch("http://localhost:3333/academicWork/addAdvisor", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify({
    //     academicWorkId: idAcademicWork,
    //     advisorId: advisorAditional.id,
    //   }),
    // });
    // // const value2: any = await response.json();
    // // console.log(value2.Data);
    // expect(response.status).toBe(200);
  });

  //   export interface UpdateAcademicWorkBasicInfoPROPS {
  //     id: string,
  //     fields: {
  //         authors?: string[],
  //         title?: string,
  //         workType?: string,
  //         year?: number,
  //         pageCount?: number,
  //         description?: string,
  //         courseId?: string,
  //         keyWords?: string[],
  //         ilustration?: string,
  //         references?: number[],
  //         cduCode?: string,
  //         cddCode?: string,
  //     }
  // }

  it(" Should be able to update basic informatino a academicWork ", async () => {
    const buffer = await fs.readFile(path.join(__dirname, "teste2.pdf"));
    const file = new File([buffer], "teste2.pdf", { type: "application/pdf" });
    const formData = new FormData();
    const token =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2M2FhN2U4LWZmZDctNGMwOS04M2FmLWU1ZTdjOTdlYTdhZSIsImlhdCI6MTc1NzM5MTk0MiwiZXhwIjoxNzU3Mzk5MTQyfQ.-WH9pSf2F8ZrRZb14EteKXC1GHgpNUNpq_F0_wRk4cs";
    formData.append("authors", JSON.stringify(["Natan Moreira", "Amanda Nudes"]));
    formData.append("idAdvisors", JSON.stringify([advisorCorrectly.id]));
    formData.append("title", "Além da Morte: Como Dark Souls Representa os Desafios e Superações da Vida Real");
    formData.append("typeWork", "Undergraduate thesis");
    formData.append("idCourse", courseCorrectly.id);
    formData.append("year", "2023");
    formData.append("qtdPag", "120");
    formData.append(
      "description",
      "Este trabalho analisa o jogo Dark Souls como uma metáfora existencial, explorando como suas mecânicas, ambientação e narrativa representam conceitos como resiliência, fracasso, aprendizado e persistência frente às adversidades do cotidiano."
    );
    formData.append(
      "keyWords",
      JSON.stringify(["Dark Souls", "Filosofia dos Jogos", "Superação", "Resiliência", "Experiência do Jogador"])
    );
    formData.append("cddCode", "794.8");
    formData.append("ilustration", "Colorful");
    formData.append("references", JSON.stringify([1, 22, 55, 66, 99]));
    formData.append("file", file);
    console.log(formData);
    const responsePreRequest: any = await fetch("http://localhost:3333/academicWork/create", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: token,
      },
    });
    if (!responsePreRequest.ok) {
      const errText = await responsePreRequest.text();
      throw new Error(`Erro ${responsePreRequest.status}: ${errText}`);
    }
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    const json = await responsePreRequest.json(); // <‑‑ aqui sim você converte o corpo em JSON
    // Ajuste ao formato que sua API devolve.
    // Pelo que vi nas mensagens anteriores, ela retorna algo como { Data: { _id: "..." } }
    const academicWorkID = json.Data?._id ?? json.id ?? json._id;
    console.log("ID gerado:", academicWorkID);
    console.log(aditionalCourse);
    const swtResponse = await fetch("http://localhost:3333/academicWork/basicUpdate", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        id: academicWorkID,
        fields: {
          authors: ["Pedro", "bbb"],
          title: "Dark Souls",
          year: 2000,
          description: "DESCRIPTION EDITED",
          courseId: aditionalCourse.id,
          references: [99, 100, 212],
        },
      }),
    });
    console.log(await swtResponse.json());
    expect(swtResponse.status).toBe(200);
  });

  it(" Delete AcademicWork ", async () => {
    // const fileBuffer = await fs.readFile(path.join(__dirname, "./", "teste1.pdf"));
    // const buffer = await fs.readFile(path.join(__dirname, "teste1.pdf"));
    // const file = new File([buffer], "teste2.pdf");
    // const formData = new FormData();
    // console.log("Tamanho do buffer:", buffer.length); // deve ser > 0
    // formData.append("authors", JSON.stringify(["Casimiro de Anchieta", "Beatriz Camargo"]));
    // formData.append("idAdvisors", JSON.stringify([advisorCorrectly.id]));
    // formData.append("title", "Análise crítica do filme Bastardos Inglórios");
    // formData.append("typeWork", "Undergraduate thesis");
    // formData.append("idCourse", courseCorrectly.id);
    // formData.append("year", "2023");
    // formData.append("qtdPag", "150");
    // formData.append("description", "Este trabalho aborda a análise da forma de pensar do Tarantino");
    // formData.append("keyWords", JSON.stringify(["Tarantino", "Quientin", "Bastardos", "Gularme"]));
    // formData.append("cddCode", "794.8");
    // formData.append("ilustration", "Colorful");
    // formData.append("references", JSON.stringify([1, 22, 55, 66, 99]));
    // formData.append("file", file); // ✅ agora sim um File real
    // console.log(formData);
    // const responsePreRequest = await fetch("http://localhost:3333/academicWork/create", {
    //   method: "POST",
    //   body: formData,
    // });
    // if (!responsePreRequest.ok) {
    //   // 4xx ou 5xx: trate o erro
    //   const errText = await responsePreRequest.text();
    //   throw new Error(`Erro ${responsePreRequest.status}: ${errText}`);
    // }
    // const json: any = await responsePreRequest.json(); // <‑‑ aqui sim você converte o corpo em JSON
    // // Ajuste ao formato que sua API devolve.
    // // Pelo que vi nas mensagens anteriores, ela retorna algo como { Data: { _id: "..." } }
    // const academicWorkID = json.Data?._id ?? json.id ?? json._id;
    // console.log("ID PARA SER DELETADO");
    // console.log(academicWorkID);
  });

  it(" Deve ser possível tornar um trabalho acadêmcio privado, como público ", async () => {
    // const fileBuffer = await fs.readFile(path.join(__dirname, "./", "teste1.pdf"));
    // const buffer = await fs.readFile(path.join(__dirname, "teste1.pdf"));
    // const file = new File([buffer], "teste2.pdf");
    // const formData = new FormData();
    // console.log("Tamanho do buffer:", buffer.length); // deve ser > 0
    // formData.append("authors", JSON.stringify(["Casimiro de Anchieta", "Beatriz Camargo"]));
    // formData.append("idAdvisors", JSON.stringify([advisorCorrectly.id]));
    // formData.append("title", "Análise crítica do filme Bastardos Inglórios");
    // formData.append("typeWork", "Undergraduate thesis");
    // formData.append("idCourse", courseCorrectly.id);
    // formData.append("year", "2023");
    // formData.append("qtdPag", "150");
    // formData.append("description", "Este trabalho aborda a análise da forma de pensar do Tarantino");
    // formData.append("keyWords", JSON.stringify(["Tarantino", "Quientin", "Bastardos", "Gularme"]));
    // formData.append("cddCode", "794.8");
    // formData.append("cduCode", "123.4");
    // formData.append("ilustration", "Colorful");
    // formData.append("references", JSON.stringify([1, 22, 55, 66, 99]));
    // formData.append("file", file); // ✅ agora sim um File real
    // console.log(formData);
    // const responsePreRequest = await fetch("http://localhost:3333/academicWork/create", {
    //   method: "POST",
    //   body: formData,
    // });
    // if (!responsePreRequest.ok) {
    //   // 4xx ou 5xx: trate o erro
    //   const errText = await responsePreRequest.text();
    //   throw new Error(`Erro ${responsePreRequest.status}: ${errText}`);
    // }
    // const json: any = await responsePreRequest.json(); // <‑‑ aqui sim você converte o corpo em JSON
    // // Ajuste ao formato que sua API devolve.
    // // Pelo que vi nas mensagens anteriores, ela retorna algo como { Data: { _id: "..." } }
    // const academicWorkID = json.Data?._id ?? json.id ?? json._id;
    // console.log("ID gerado:", academicWorkID);
    // expect(response.status).toBe(201);
    // console.log(response.body);
  });
});
