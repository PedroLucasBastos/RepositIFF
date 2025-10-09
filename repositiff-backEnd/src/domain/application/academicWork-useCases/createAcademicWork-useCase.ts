import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
// import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
// import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { Author, AuthorsProps } from "@src/domain/entities/author.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { AcademicWork, Illustration, typeWork } from "@src/domain/entities/academicWork.js";
import { Course } from "@src/domain/entities/course.js";
import { MapperAcademicWork } from "@src/mappers/mapperAcademicWork.js";
import { Role } from "@src/domain/entities/user.js";

type response = EitherOO<DomainError, AcademicWork>;
// type FindAdvisorResult = {
//     id: string;
//     advisor: Advisor | null;
// };
export interface CreateProjectUseCaseDTO {
  authors: string[];
  idAdvisors: string[];
  title: string;
  typeWork: string;
  year: number;
  qtdPag: number;
  description: string;
  idCourse: string;
  keyWords: string[];
  ilustration: string;
  references: number[];
  cduCode?: string;
  cddCode?: string;
  file?: Buffer;
}

interface IFile {
  name: string;
  path: string;
}
export class CreateProjectUseCase {
  constructor(
    private _academicRepo: IAcademicWorkRepository,
    private _advisorRepo: IAdvisorRepository,
    private _courseRepo: ICourseRepository,
    private _fileStorage: IFileStorage
    // private _generatedCutterNumber: IGenerateCutterNumber,
    // private academicWorkSearch: IAcademicWorkSearch
  ) {}

  async execute(newAcademicWorkDTO: CreateProjectUseCaseDTO, userRole: string): Promise<response> {
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
    const { authors, file, idCourse, idAdvisors, typeWork: type, title } = newAcademicWorkDTO;
    let cutterNumber = "cutter-number-test";
    let key = "www.localhost.com.br";

    if (!Object.values(typeWork).includes(type as typeWork))
      return new Left(new DomainError(ErrorCategory.Application, "ERROR_TYPEWORK", `Error to convert typework`));

    const advisorsOrError = await this.findAllAdvisors(idAdvisors);
    let advisorsList: Advisor[] = [];
    if (advisorsOrError.isRight()) advisorsList = advisorsOrError.value;
    else if (advisorsOrError.isLeft()) return new Left(advisorsOrError.value);
    const courseOrNull = await this._courseRepo.findCourseById(idCourse);
    let courseResult: Course;
    if (!courseOrNull)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_SELECTING_COURSE",
          `The course ID ${idCourse} is not found in the database`
        )
      );
    else courseResult = courseOrNull;

    const academicWorkOrError = AcademicWork.createAcademicWorkFactory({
      authors: authors,
      advisors: advisorsList,
      title: newAcademicWorkDTO.title,
      typeWork: newAcademicWorkDTO.typeWork as typeWork,
      year: newAcademicWorkDTO.year,
      qtdPag: newAcademicWorkDTO.qtdPag,
      description: newAcademicWorkDTO.description,
      course: courseResult,
      keyWords: newAcademicWorkDTO.keyWords,
      illustration: newAcademicWorkDTO.ilustration as Illustration,
      references: newAcademicWorkDTO.references,
      // cutterNumber: "M934",
      cddCode: newAcademicWorkDTO.cddCode,
      cduCode: newAcademicWorkDTO.cduCode,
    });

    if (academicWorkOrError.isLeft())
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_INSTATIATE_ACADEMICWORK_ENTITY",
          academicWorkOrError.value.details
        )
      );
    const academicWorkEntity = academicWorkOrError.value as AcademicWork;
    const resultDB = await this._academicRepo.addAcademicWork({
      idAcademicWork: academicWorkEntity.id,
      authors: academicWorkEntity.authors,
      idAdvisors: academicWorkEntity.advisors.map((advisor) => advisor.id),
      title: academicWorkEntity.title,
      typeWork: academicWorkEntity.typeWork,
      year: academicWorkEntity.year,
      qtdPag: academicWorkEntity.qtdPag,
      description: academicWorkEntity.description,
      idCourse: academicWorkEntity.course.id,
      keyWords: academicWorkEntity.keyWords,
      ilustration: academicWorkEntity.ilustration,
      references: academicWorkEntity.references,
      cutterNumber: academicWorkEntity.cutterNumber,
      cduCode: academicWorkEntity.cduCode,
      cddCode: academicWorkEntity.cddCode,
      file: academicWorkEntity.file,
    });
    if (resultDB instanceof Error)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_CADASTRATED_ACADEMICWORK",
          resultDB.message,
          resultDB,
          resultDB.name
        )
      );

    if (file != undefined) {
      await this._fileStorage.upload(academicWorkEntity.file, file);
    }
    const academicWorkResult = MapperAcademicWork.dtoToEntity(resultDB);


    if (academicWorkResult instanceof DomainError)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_MAPPING_ACADEMICWORK",
          academicWorkResult.message,
          academicWorkResult,
          academicWorkResult.name
        )
      );
    return new Right(academicWorkResult);
  }

  async findAllAdvisors(idAdvisors: string[]): Promise<EitherOO<DomainError, Advisor[]>> {
    const advisorsList = await Promise.all(
      idAdvisors.map(async (advisorId) => {
        const advisor = await this._advisorRepo.findAdvisorById(advisorId);
        return { id: advisorId, advisor };
      })
    );
    const invalidAdvisors = advisorsList.filter((result) => result.advisor === null).map((result) => result.id);

    if (invalidAdvisors.length > 0)
      return new Left(
        new DomainError(
          ErrorCategory.Application,
          "ERROR_TO_SELECTING_ADVISORS",
          `Any supervisor ID provided is incorrect \n Invalid IDs: ${invalidAdvisors}`
        )
      );
    return new Right(advisorsList.map((advisor) => advisor.advisor as Advisor));
  }
}
