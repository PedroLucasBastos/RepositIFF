import { Course, degreeType, ICourseProps } from "@src/domain/entities/course.js";
import { Role } from "@src/domain/entities/user.js";
import { CourseValidator } from "@src/domain/entities/validators/course-validators.js";
import { CourseErrorDomain } from "@src/domain/errorsDomain/courseErrorDomain.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";
export interface ICourseUpdateProps {
  courseId: string;
  updateFields: ICourseUpdateFields;
}
export interface ICourseUpdateFields {
  name?: string;
  courseCode?: string;
  degreeType?: degreeType;
}
export class UpdateCourseUseCase {
  constructor(private _repo: ICourseRepository) {}
  async execute(props: ICourseUpdateProps, userRole: string): Promise<EitherOO<DomainError, Course>> {
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
    const { courseId, updateFields } = props;
    // const course = await this._repo.findCourseById(courseId);
    // if (!course)
    //     return new Left(CourseErrorDomain.CourseNotFound());
    const parametersValidToUpdateOrNot = this.updateEntityProps(updateFields);
    if (parametersValidToUpdateOrNot.isLeft()) return new Left(parametersValidToUpdateOrNot.value);
    const resultOrError = await this._repo.updateCourse(courseId, updateFields);
    if (resultOrError instanceof Error)
      return new Left(
        new DomainError(ErrorCategory.Application, "ERROR_TO_UPDATE_COURSE", resultOrError.message, resultOrError)
      );
    return new Right(resultOrError as Course);
  }

  updateEntityProps(props: ICourseUpdateFields): EitherOO<DomainError, void> {
    const { name, courseCode: courseCode, degreeType } = props;
    const resultList = [];
    if (name) resultList.push(CourseValidator.validateNameField(name));
    if (courseCode) resultList.push(CourseValidator.validateCourseCodeField(courseCode));
    if (degreeType) resultList.push(CourseValidator.validateDegreeType(degreeType));
    const errorList = resultList
      .filter((error) => error.isLeft()) // Filtra para pegar apenas os erros
      .map((error) => error.value.details)
      .flat();
    if (errorList.length > 0) return new Left(CourseErrorDomain.InvalidParameters(errorList.join("\n")));
    return new Right(undefined);
  }
}
