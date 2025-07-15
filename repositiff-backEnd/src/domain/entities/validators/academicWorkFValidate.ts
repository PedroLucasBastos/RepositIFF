import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { academicWorkProps, Illustration, typeWork } from "../academicWork.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Author } from "@src/domain/entities/author.js";
import { AcademicWorkErros } from "@src/domain/errorsDomain/academicWorkErrorDomain.js";
import { Course } from "../course.js";
import { Advisor } from "../advisor.js";
import { IUpdateAcademicWorkUseCaseDTO } from "@src/domain/application/academicWork-useCases/updateAcademicWork-use-case.js";

export interface udpateProps {
  authors?: string[];
  advisors?: Advisor[];
  title?: string;
  year?: number;
  qtdPag?: number;
  description?: string;
  course?: Course;
  typeWork?: typeWork;
  keyWords?: string[];
  illustration?: Illustration;
  references?: number[];
  file?: string;
  cutterNumber?: string;
  cduCode?: string;
  cddCode?: string;
}

export class AcademicWorkValitador {
  static validateInitiateProps(props: academicWorkProps): EitherOO<DomainError, void> {
    const errorList: string[] = [
      AcademicWorkValitador.validateTitle(props.title),
      AcademicWorkValitador.validateYear(props.year),
      AcademicWorkValitador.validateQtdPag(props.qtdPag),
      AcademicWorkValitador.validateAuthors(props.authors),
      AcademicWorkValitador.validateAdvisors(props.advisors),
      AcademicWorkValitador.validateTypeWork(props.typeWork),
      AcademicWorkValitador.validateDescription(props.description),
      AcademicWorkValitador.validateCourse(props.course),
      AcademicWorkValitador.validateKeyWords(props.keyWords),
      AcademicWorkValitador.validateCutterNumber(props.cutterNumber),
      props.cduCode ? AcademicWorkValitador.validateCduCode(props.cduCode) : new Right(undefined),
      props.cddCode ? AcademicWorkValitador.validateCddCode(props.cddCode) : new Right(undefined),
    ]
      .filter((error): error is Left<DomainError, void> => error.isLeft())
      .map((error) => error.value.details)
      .flat();

    if (errorList.length > 0) return new Left(AcademicWorkErros.InvalidParameters(errorList.join("\n")));
    return new Right(undefined);
  }

  static validateUpdatedProps(props: IUpdateAcademicWorkUseCaseDTO): EitherOO<DomainError, void> {
    const errorList: string[] = [
      props.title ? AcademicWorkValitador.validateTitle(props.title) : new Right(undefined),
      props.year ? AcademicWorkValitador.validateYear(props.year) : new Right(undefined),
      props.qtdPag ? AcademicWorkValitador.validateQtdPag(props.qtdPag) : new Right(undefined),
      props.authors ? AcademicWorkValitador.validateAuthors(props.authors) : new Right(undefined),
      props.typeWork ? AcademicWorkValitador.validateTypeWork(props.typeWork) : new Right(undefined),
      props.file ? AcademicWorkValitador.validateFile(props.file) : new Right(undefined),
      props.description ? AcademicWorkValitador.validateDescription(props.description) : new Right(undefined),
      props.keyWords ? AcademicWorkValitador.validateKeyWords(props.keyWords) : new Right(undefined),
      props.cduCode ? AcademicWorkValitador.validateCduCode(props.cduCode) : new Right(undefined),
      props.cddCode ? AcademicWorkValitador.validateCddCode(props.cddCode) : new Right(undefined),
    ]
      .filter((error): error is Left<DomainError, void> => error.isLeft())
      .map((error) => error.value.details)
      .flat();

    if (errorList.length > 0) return new Left(AcademicWorkErros.InvalidParameters(errorList.join("\n")));
    return new Right(undefined);
  }

  static validateQtdPag(qtdPag: number): EitherOO<DomainError, void> {
    if (qtdPag <= 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The number of pages is invalid"));
    }
    return new Right(undefined);
  }

  static validateAdvisors(advisors: Advisor[]): EitherOO<DomainError, void> {
    if (advisors.length === 0) {
      return new Left(AcademicWorkErros.InvalidParameters("At least one advisor is required"));
    }
    return new Right(undefined);
  }

  static validateTypeWork(type: string): EitherOO<DomainError, void> {
    if (!Object.values(typeWork).includes(type as typeWork)) return new Left(new DomainError(ErrorCategory.Application, "ERROR_TYPEWORK", `Error to convert typework`));
    return new Right(undefined);
  }

  static validateDescription(description: string): EitherOO<DomainError, void> {
    if (!description || description.trim().length === 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The description is invalid"));
    }
    return new Right(undefined);
  }

  static validateCourse(course: Course): EitherOO<DomainError, void> {
    if (!course) {
      return new Left(AcademicWorkErros.InvalidParameters("The course is invalid"));
    }
    return new Right(undefined);
  }

  static validateKeyWords(keyWords: string[]): EitherOO<DomainError, void> {
    if (!keyWords || keyWords.length === 0) {
      return new Left(AcademicWorkErros.InvalidParameters("At least one keyword is required"));
    }
    return new Right(undefined);
  }

  static validateTitle(title: string): EitherOO<DomainError, void> {
    if (!title || title.trim().length === 0) {
      return new Left(AcademicWorkErros.InvalidParameters("A title has invalid"));
    }
    return new Right(undefined);
  }

  static validateYear(year: number): EitherOO<DomainError, void> {
    console.log(`year: ${year}`);
    console.log(year < 1900);
    console.log(year > new Date().getFullYear());
    console.log(year < 1900 || year > new Date().getFullYear());
    if (year < 1900 || year > new Date().getFullYear()) {
      return new Left(AcademicWorkErros.InvalidParameters("The year has invalid aasdf"));
    }
    return new Right(undefined);
  }

  static validateqtdPag(qtdPag: number): EitherOO<DomainError, void> {
    if (qtdPag <= 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The qtd has invalid"));
    }
    return new Right(undefined);
  }

  static validateAuthors(authors: string[]): EitherOO<DomainError, void> {
    if (authors.length === 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The authors has invalid"));
    }
    return new Right(undefined);
  }

  static validateFile(file: Buffer): EitherOO<DomainError, void> {
    if (!Buffer.isBuffer(file)) return new Left(AcademicWorkErros.InvalidParameters(" The file is valid "));
    return new Right(undefined);
  }

  static validateCutterNumber(cutterNumber?: string): EitherOO<DomainError, void> {
    if (!cutterNumber || cutterNumber.length < 0) {
      console.log("\n CUTTER INVÁLIDO");
      console.log(cutterNumber);
      return new Left(AcademicWorkErros.InvalidParameters("The Cutter Number is invalid S2"));
    }
    return new Right(undefined);
  }

  static validateCduCode(cduCode?: string): EitherOO<DomainError, void> {
    if (!cduCode || cduCode.length < 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The CDU Code is invalid"));
    }

    return new Right(undefined);
  }

  static validateCddCode(cddCode?: string): EitherOO<DomainError, void> {
    if (!cddCode || cddCode.length < 0) {
      return new Left(AcademicWorkErros.InvalidParameters("The CDD Code is invalid"));
    }

    return new Right(undefined);
  }

  static validateChangeVisibility(props: academicWorkProps): EitherOO<DomainError, void> {
    const errorList: string[] = [
      AcademicWorkValitador.validateTitle(props.title),
      AcademicWorkValitador.validateYear(props.year),
      AcademicWorkValitador.validateQtdPag(props.qtdPag),
      AcademicWorkValitador.validateAuthors(props.authors),
      AcademicWorkValitador.validateAdvisors(props.advisors),
      AcademicWorkValitador.validateTypeWork(props.typeWork),
      AcademicWorkValitador.validateDescription(props.description),
      AcademicWorkValitador.validateCourse(props.course),
      AcademicWorkValitador.validateKeyWords(props.keyWords),
      // AcademicWorkValitador.validateTypeWork(props.file),
      AcademicWorkValitador.validateCutterNumber(props.cutterNumber),
      AcademicWorkValitador.validateCduCode(props.cduCode),
      AcademicWorkValitador.validateCddCode(props.cddCode),
    ]
      .filter((error): error is Left<DomainError, void> => error.isLeft())
      .map((error) => error.value.details)
      .flat();

    if (errorList.length > 0) return new Left(AcademicWorkErros.InvalidChangeVisibility(errorList.join("\n")));
    return new Right(undefined);
  }
}
