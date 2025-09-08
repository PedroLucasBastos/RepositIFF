import { PrismaAdvisorRepository } from "@src/infra/repositories/prisma/prisma-advisor-repository.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { Course, degreeType } from "@src/domain/entities/course.js";
import { PrismaCourseRepostory } from "@src/infra/repositories/prisma/prisma-course-repostory.js";
import { CreateAdvisorUseCase } from "../../advisor-useCases/createAdvisor-useCase.js";
import { AdvisorsProducts } from "../../advisor-useCases/tests/advisorsProducts.js";
import { CoursesToTests } from "../../course-use-case/tests/coursesToTests.js";
import { CreateCourseUseCase } from "../../course-use-case/create-course-use-case.js";

type response = {
  advisor: Advisor;
  course: Course;
};

export class DependeciesAcademicTest {
  static async allCorrectly(): Promise<response> {
    const advisorRepo = new PrismaAdvisorRepository();
    const useCaseAdvisor = new CreateAdvisorUseCase(advisorRepo);
    const advisorValid = AdvisorsProducts.valid();

    const advisorUseCaseOrError = await useCaseAdvisor.execute(advisorValid, "LIBRARIAN");

    if (advisorUseCaseOrError.isLeft()) {
      throw new Error("Deu merda aki");
    }
    let advisor = advisorUseCaseOrError.value as Advisor;

    const courseRepo = new PrismaCourseRepostory();
    const sut = CoursesToTests.Correctly();
    const useCaseCourse = new CreateCourseUseCase(courseRepo);
    const result = await useCaseCourse.execute(sut, "ADMIN");
    const course = result.value as Course;

    return {
      advisor: advisor,
      course: course,
    };
  }

  static async aditionalAdvisor(): Promise<Advisor> {
    const advisorRepo = new PrismaAdvisorRepository();
    const useCaseAdvisor = new CreateAdvisorUseCase(advisorRepo);
    const advisorUseCaseOrError = await useCaseAdvisor.execute(
      {
        name: "Raquel-adicional",
        surname: "Duarte",
        registrationNumber: "5555555",
      },
      "LIBRARIAN"
    );
    let advisor = advisorUseCaseOrError.value as Advisor;

    return advisor;
  }

  static async aditionalCourse(): Promise<Course> {
    const courseRepo = new PrismaCourseRepostory();
    const useCaseCourse = new CreateCourseUseCase(courseRepo);
    const sut = {
      name: "Engenharia da Computação",
      courseCode: "CO255",
      degreeType: degreeType.Bachelor,
    };
    const result = await useCaseCourse.execute(sut, "ADMIN");
    return result.value as Course;
  }

  static async basicInfo(): Promise<Course> {
    const courseRepo = new PrismaCourseRepostory();
    const sut = CoursesToTests.Correctly();
    const useCaseCourse = new CreateCourseUseCase(courseRepo);
    const result = useCaseCourse.execute(sut, "ADMIN");
    const course = (await result).value as Course;
    return course;
  }
}
