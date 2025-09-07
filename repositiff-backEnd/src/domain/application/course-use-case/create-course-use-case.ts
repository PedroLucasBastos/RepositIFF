import { Course, ICourseProps } from "@src/domain/entities/course.js";
import { Role } from "@src/domain/entities/user.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";

type response = EitherOO<DomainError, Course>;

export class CreateCourseUseCase {
  constructor(
    private _repo: ICourseRepository,
    private userRole: string
  ) {}

  async execute(newCourseProps: ICourseProps, userRole: string): Promise<response> {
    if (userRole !== Role.ADMIN) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "PERMISSION_DENIED",
          "Only users with ADMIN role can create courses.",
          new Error("Permission denied")
        )
      );
    }
    const { name, courseCode, degreeType } = newCourseProps;
    const courseOrError = Course.createCourse({
      name,
      courseCode,
      degreeType,
    });
    // console.log(courseOrError.value);
    if (courseOrError.isLeft()) return new Left(courseOrError.value);
    const course = courseOrError.value as Course;
    const resultOrError = await this._repo.addCourse(course);
    if (resultOrError instanceof Error)
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_CADASTRATE_COURSE", resultOrError.message, resultOrError)
      );
    return new Right(resultOrError as Course);
  }
}
