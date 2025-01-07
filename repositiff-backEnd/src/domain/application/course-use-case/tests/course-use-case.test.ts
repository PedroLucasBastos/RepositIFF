import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { describe, expect, it } from "vitest";
import { CoursesToTests } from "@src/domain/application/course-use-case/tests/coursesToTests.js";
import { CreateCourseUseCase } from '@src/domain/application/course-use-case/create-course-use-case.js';
import { Course } from "@src/domain/entities/course.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { UpdateCourseUseCase } from "../update-course-use-case.js";
import { DeleteCourseUseCase } from "../delete-course-use-case.js";



describe("Test the guiding actor use cases", () => {
    const repo = new PrismaCourseRepostory();
    it("Should ble able to create and registred a course in database", async () => {
        const sut = CoursesToTests.Correctly();
        const useCase = new CreateCourseUseCase(repo);
        const result = await useCase.execute(sut);
        const course = result.value as Course;
        expect(result.isRight()).toBeTruthy();
        expect(course.getName).equal(sut.name);
        expect(course.getCourseCode).equal(sut.courseCode);
        expect(course.getDegreeType).equal(sut.degreeType);
    })
    it("Should not be able to create and registred a course in database with a same course code", async () => {
        const sut = CoursesToTests.Correctly();
        const useCase = new CreateCourseUseCase(repo);
        const result = await useCase.execute(sut);
        expect(result.isLeft()).toBeTruthy();
        expect(result.value).instanceOf(DomainError);
        const error = result.value as DomainError;
        expect(error.category).toEqual(ErrorCategory.Application);
        expect(error.message).toEqual("ERROR_TO_CADASTRATE_COURSE");
        expect(error.details).toEqual("Duplicate value for unique field(s) - PRISMA ERROR CODE P2002");
    })
    it("Should be able to update a course in database", async () => {
        const sut = CoursesToTests.Correctly();
        const findResult = await repo.findCourseByCode(sut.courseCode);
        const update = new UpdateCourseUseCase(repo);
        const course = findResult as Course
        const resultOrError = await update.execute({
            courseId: course.getId,
            updateFields: {
                name: "Engenharia da Computação",
                courseCode: "Eng1045",
            }
        })
        const updatedCourse = resultOrError.value as Course;
        expect(updatedCourse.getName).equal("Engenharia da Computação");
        expect(updatedCourse.getCourseCode).equal("Eng1045");
    })
    it("Should be able to delete a course in database", async () => {
        const findResult = await repo.findCourseByCode("Eng1045");
        const del = new DeleteCourseUseCase(repo);
        const course = findResult as Course
        const deleteOrError = await del.execute({ courseId: course.getId })

        expect(deleteOrError.isRight()).toBeTruthy()
        const verification = await repo.findCourseByCode("Eng1045");
        expect(verification).toBeNull();
    })
})