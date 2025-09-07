import { Role } from "@src/domain/entities/user.js";
import { AcademicWorkValitador } from "@src/domain/entities/validators/academicWorkFValidate.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Right } from "@src/error_handling/either.Funcional.js";
import { Left } from "@src/error_handling/either.Funcional.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";

export interface UpdateAcademicWorkBasicInfoPROPS {
  id: string;
  fields: {
    authors?: string[];
    title?: string;
    workType?: string;
    year?: number;
    pageCount?: number;
    description?: string;
    courseId?: string;
    keyWords?: string[];
    ilustration?: string;
    references?: number[];
    cduCode?: string;
    cddCode?: string;
  };
}
export class UpdateAcademicWorkBasicInfoUseCase {
  constructor(private readonly _repo: IAcademicWorkRepository) {}
  async execute(props: UpdateAcademicWorkBasicInfoPROPS, userRole: string) {
    if (userRole !== Role.LIBRARIAN) {
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "PERMISSION_DENIED",
          "your role does not have permission",
          new Error("Permission denied")
        )
      );
    }
    const validateResult = AcademicWorkValitador.validateUpdatedProps(props.fields);

    console.log("\nRQEUISIÇÃO QUE CHEGOU AO USE CASE\n");

    console.log(validateResult);

    if (validateResult.isLeft()) return new Left(validateResult.value);
    const resultUpdated = await this._repo.updateAcademicWorkFields({
      id: props.id,
      fields: {
        authors: props.fields.authors,
        description: props.fields.description,
        cddCode: props.fields.cddCode,
        cduCode: props.fields.cduCode,
        references: props.fields.references,
        title: props.fields.title,
        idCourse: props.fields.courseId,
        keyWords: props.fields.keyWords,
        qtdPag: props.fields.pageCount,
        typeWork: props.fields.workType,
        year: props.fields.year,
        ilustration: props.fields.ilustration,
      },
    });
    if (resultUpdated instanceof Error) {
      return new Left(
        new DomainError(ErrorCategory.Application, "Error to updated academicWork", resultUpdated.message)
      );
    }
    return new Right(resultUpdated);
  }
}
