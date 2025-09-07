import { Course } from "@src/domain/entities/course.js";
import { Role } from "@src/domain/entities/user.js";
import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";

export interface IDeleteProps {
  courseId: string;
}

export class DeleteCourseUseCase {
  constructor(
    private _repo: ICourseRepository,
    private userRole: string
  ) {}

  async execute(props: IDeleteProps, userRole: string): Promise<EitherOO<DomainError, Course>> {
    if (userRole !== Role.ADMIN) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "PERMISSION_DENIED",
          "your role does not have permission",
          new Error("Permission denied")
        )
      );
    }
    const course = await this._repo.deleteCourse(props.courseId);
    if (!course) return new Left(CourseErrorDomain.CourseNotFound());
    return new Right(course as Course);
  }
}
