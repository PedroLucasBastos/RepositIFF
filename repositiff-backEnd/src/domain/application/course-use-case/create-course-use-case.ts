import { Course, ICourseProps } from "@src/domain/entities/course.js";
import { CourseFactory } from "@src/domain/entities/factories/couseFatory.js";
import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";

type response = Either<DomainError, Course>

export class CreateCourseUseCase {
    constructor(
        private _repo: ICourseRepository
    ) { }

    async execute(newCourseProps: ICourseProps): Promise<response> {
        const { name, courseCode, degreeType } = newCourseProps;
        const courseOrError = Course.createCourse(
            {
                name,
                courseCode,
                degreeType
            }
        )
        // console.log(courseOrError.value);
        if (courseOrError.isLeft())
            return new Left(courseOrError.value);
        const course = courseOrError.value as Course;
        const resultOrError = await this._repo.addCourse(course);
        if (resultOrError instanceof Error)
            return new Left(
                new DomainError(
                    ErrorCategory.Application,
                    "ERROR_TO_CADASTRATE_COURSE",
                    resultOrError.message,
                    resultOrError
                )
            )
        return new Right(resultOrError as Course);
    }
}