import { IAcademicWorkRepository } from "@src/infra/repositories/IAcademicWorkRepository.js";
// import { AcademicWork } from "@src/domain/entities/academicWork.js";
import { IFileStorage } from "@src/infra/fileStorage/IFileStorage.js";
// import { Advisor, AdvisorProps } from "@src/domain/entities/advisor.js";
import { Author, AuthorsProps } from "@src/domain/entities/author.js";
import { IAdvisorRepository } from "@src/infra/repositories/IAdvisorRepository.js";
import { ICourseRepository } from "@src/infra/repositories/ICourse-repository.js";
import { IGenerateCutterNumber } from "@src/infra/cutter-number/IGenerateCutterNumber.js";
import { Advisor } from "@src/domain/entities/advisor.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { AcademicWork, Illustration, typeWork } from "@src/domain/entities/academicWork.js";
import { Course } from "@src/domain/entities/course.js";
import { MapperAcademicWork } from "@src/mappers/mapperAcademicWork.js";
import { AcademicWorkFile } from "@src/domain/entities/academicWorkFile.js";

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

  async execute(newAcademicWorkDTO: CreateProjectUseCaseDTO): Promise<response> {
    const { authors, file, idCourse, idAdvisors, typeWork: type, title } = newAcademicWorkDTO;
    let newFile: AcademicWorkFile;
    let cutterNumber = "cutter-number-test";
    let key = "www.localhost.com.br";

    console.log("\nparametros que vieram");
    console.log(newAcademicWorkDTO);
    console.log("\n---------------------------------\n\n");
    // console.log("asdklfjasdfieklasdjfioejklasdfjased")
    // Object.values(TypeWork).includes(typeString as TypeWork)
    if (!Object.values(typeWork).includes(type as typeWork)) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TYPEWORK", `Error to convert typework`));

    console.log("passou do primeiro if");
    const advisorsOrError = await this.findAllAdvisors(idAdvisors);
    let advisorsList: Advisor[] = [];
    if (advisorsOrError.isRight()) advisorsList = advisorsOrError.value;
    else if (advisorsOrError.isLeft()) return new Left(advisorsOrError.value);
    console.log("Dps de Advisor");
    const courseOrNull = await this._courseRepo.findCourseById(idCourse);
    let courseResult: Course;
    if (!courseOrNull) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_SELECTING_COURSE", `The course ID ${idCourse} is not found in the database`));
    else courseResult = courseOrNull;
    console.log("Advisor e course foi");

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
      cutterNumber: "M934",
      cddCode: newAcademicWorkDTO.cddCode,
      cduCode: newAcademicWorkDTO.cduCode,
    });

    console.log("DPS DE INSTANCIAR");
    console.log(academicWorkOrError);
    if (academicWorkOrError.isLeft()) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_INSTATIATE_ACADEMICWORK_ENTITY", academicWorkOrError.value.details));
    const academicWorkEntity = academicWorkOrError.value as AcademicWork;
    console.log("Na beira de mandar apr o BD");
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
    if (resultDB instanceof Error) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_CADASTRATED_ACADEMICWORK", resultDB.message, resultDB, resultDB.name));
    console.log("Result depois de criar a entidade - ");

    if (file != undefined) {
      // console.log()
      newFile = new AcademicWorkFile({
        title: title,
        key: academicWorkEntity.id,
      });
      await this._fileStorage.upload(academicWorkEntity.file, file);
    }

    const academicWorkResult = MapperAcademicWork.dtoToEntity(resultDB);
    if (academicWorkResult instanceof DomainError) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_MAPPING_ACADEMICWORK", academicWorkResult.message, academicWorkResult, academicWorkResult.name));
    console.log("VERIFICAÇÃO");
    console.log(`ID DA ENTIDADE: ${resultDB.id}`);
    console.log(`ID da volta do DB: ${academicWorkResult.id}`);
    console.log("==============================================================");
    return new Right(academicWorkResult);
  }

  // async uploadedFile(file: IFile): Promise<void> {
  //     try {

  //         const fileBuffer = await fs.readFile(file.path);
  //         await
  //     } catch (error) {
  //         console.error('Erro ao ler o arquivo:', error);
  //     }
  // }

  async findAllAdvisors(idAdvisors: string[]): Promise<EitherOO<DomainError, Advisor[]>> {
    const advisorsList = await Promise.all(
      idAdvisors.map(async (advisorId) => {
        const advisor = await this._advisorRepo.findAdvisorById(advisorId);
        return { id: advisorId, advisor };
      })
    );
    const invalidAdvisors = advisorsList.filter((result) => result.advisor === null).map((result) => result.id);

    if (invalidAdvisors.length > 0) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TO_SELECTING_ADVISORS", `Any supervisor ID provided is incorrect \n Invalid IDs: ${invalidAdvisors}`));
    return new Right(advisorsList.map((advisor) => advisor.advisor as Advisor));
  }
}
