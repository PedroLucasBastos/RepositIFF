import { Course } from "@src/domain/entities/course.js";
import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";

export interface IDeleteProps {
    courseId: string;
}

export class DeleteCourseUseCase {
    constructor(
        private _repo: ICourseRepository
    ) { }

    async execute(props: IDeleteProps): Promise<Either<DomainError, Course>> {
        const course = await this._repo.deleteCourse(props.courseId);
        if (!course)
            return new Left(CourseErrorDomain.CourseNotFound());
        return new Right(course as Course);
    }
}