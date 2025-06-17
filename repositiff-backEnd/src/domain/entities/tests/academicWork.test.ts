import { describe, it, expect } from "vitest";
import { AcademicWork, academicWorkProps, Illustration, typeWork } from "../academicWork.js";
import { Author } from "../author.js";
import { Advisor } from "../advisor.js";
import { EitherOO } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { AdvisorFactory } from "../factories/advisorFactory.js";
import { Course, degreeType } from "../course.js";

describe("Instatiate a AcademicWork entity", () => {
    it("should create a valid academic work object", () => {
        const advisorOrError: EitherOO<DomainError, Advisor> = AdvisorFactory.createAdvisor({
            name: "Juciaryus",
            surname: "Alm`ida",
            registrationNumber: "24242424"
        });
        const courseOrError = Course.createCourse({
            name: "Sistemas de Informação",
            courseCode: "SI200",
            degreeType: degreeType.Bachelor
        });

        const props: academicWorkProps = {
            authors: [
                "Fulano de Tal",
                "Ciclano de tal"
            ],
            advisors: [advisorOrError.value as Advisor],
            title: "The Role of AI in Modern Science",
            typeWork: typeWork.Undergraduate, // Supondo que seja um enum
            year: 2023,
            qtdPag: 150,
            description: "A detailed study on the impact of AI in various scientific fields.",
            course: courseOrError.value as Course,
            keyWords: ["Artificial Intelligence", "Machine Learning", "Science"],
            file: "https://example.com/ai-thesis.pdf",
            cutterNumber: "D123",
            cduCode: "004.8",
            cddCode: "006.3",
            illustration: Illustration.NOT,
            references: []
        };

        const academicWorkOrError = AcademicWork.createAcademicWorkFactory(props);

        expect(academicWorkOrError.isRight()).toBeTruthy();
        const academicWork = academicWorkOrError.value as AcademicWork;
        expect(academicWork).toBeDefined();
        expect(academicWork.title).toBe("The Role of AI in Modern Science");
        expect(academicWork.year).toBe(2023);
        expect(academicWork.qtdPag).toBe(150);
        // expect(validAcademicWork.authors.length).toBeGreaterThan(0);
        // expect(validAcademicWork.authors[0]).toBeInstanceOf(Author);
        // expect(validAcademicWork.authors[0]._id).toBeDefined();
        // expect(validAcademicWork.authors[0]._props.name).toBe("John");
        // expect(validAcademicWork.advisors.length).toBeGreaterThan(0);
        // expect(validAcademicWork.course.name).toBe("Computer Science");
    });
})
