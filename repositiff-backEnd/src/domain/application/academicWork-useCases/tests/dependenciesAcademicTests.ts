import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { Course } from "@src/domain/entities/course.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { CreateAdvisorUseCase } from "../../advisor-useCases/createAdvisor-useCase.js";
import { AdvisorsProducts } from "../../advisor-useCases/tests/advisorsProducts.js";
import { CoursesToTests } from "../../course-use-case/tests/coursesToTests.js";
import { CreateCourseUseCase } from "../../course-use-case/create-course-use-case.js";

type response = {
    advisor: Advisor,
    course: Course
}

export class DependeciesAcademicTest {
    static async allCorrectly(): Promise<response> {
        const advisorRepo = new PrismaAdvisorRepository();
        const useCaseAdvisor = new CreateAdvisorUseCase(advisorRepo);
        const advisorValid = AdvisorsProducts.valid();

        const advisorUseCaseOrError = await useCaseAdvisor.execute(advisorValid);

        if (advisorUseCaseOrError.isLeft()) {
            throw new Error("Deu merda aki");
        }
        let advisor = advisorUseCaseOrError.value as Advisor

        const courseRepo = new PrismaCourseRepostory();
        const sut = CoursesToTests.Correctly();
        const useCaseCourse = new CreateCourseUseCase(courseRepo);
        const result = await useCaseCourse.execute(sut);
        const course = result.value as Course;

        return {
            advisor: advisor,
            course: course,
        }
    }




    static async basicInfo(): Promise<Course> {
        const courseRepo = new PrismaCourseRepostory();
        const sut = CoursesToTests.Correctly();
        const useCaseCourse = new CreateCourseUseCase(courseRepo);
        const result = useCaseCourse.execute(sut);
        const course = (await result).value as Course;
        return course;
    }
}