import { Either, Left, Right } from "@src/error_handling/either.js";
import { academicWorkProps } from "../academicWork.js";
import { DomainError, ErrorCategory } from "@src/error_handling/domainServicesErrors.js";
import { Author } from "@src/domain/entities/author.js";
import { AcademicWorkErros } from "@src/domain/errorsDomain/academicWorkErrorDomain.js";
import { Course } from "../course.js";
import { Advisor } from "../advisor.js";

export class AcademicWorkValitador {
    static validateInitiateProps(props: academicWorkProps): Either<DomainError, void> {
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
            props.url ? AcademicWorkValitador.validateUrl(props.url) : new Right(undefined),
            props.cutterNumber ? AcademicWorkValitador.validateCutterNumber(props.cutterNumber) : new Right(undefined),
            props.cduCode ? AcademicWorkValitador.validateCduCode(props.cduCode) : new Right(undefined),
            props.cddCode ? AcademicWorkValitador.validateCddCode(props.cddCode) : new Right(undefined)
        ]
            .filter((error): error is Left<DomainError, void> => error.isLeft())
            .map((error) => error.value.details)
            .flat();

        if (errorList.length > 0)
            return new Left(AcademicWorkErros.InvalidParameters(errorList.join("\n")));
        return new Right(undefined);
    }

    static validateQtdPag(qtdPag: number): Either<DomainError, void> {
        if (qtdPag <= 0) {
            return new Left(AcademicWorkErros.InvalidParameters("The number of pages is invalid"));
        }
        return new Right(undefined);
    }

    static validateAdvisors(advisors: Advisor[]): Either<DomainError, void> {
        if (advisors.length === 0) {
            return new Left(AcademicWorkErros.InvalidParameters("At least one advisor is required"));
        }
        return new Right(undefined);
    }

    static validateTypeWork(typeWork: string): Either<DomainError, void> {
        if (!typeWork || typeWork.trim().length === 0) {
            return new Left(AcademicWorkErros.InvalidParameters("The type of work is invalid"));
        }
        return new Right(undefined);
    }

    static validateDescription(description: string): Either<DomainError, void> {
        if (!description || description.trim().length === 0) {
            return new Left(AcademicWorkErros.InvalidParameters("The description is invalid"));
        }
        return new Right(undefined);
    }

    static validateCourse(course: Course): Either<DomainError, void> {
        if (!course) {
            return new Left(AcademicWorkErros.InvalidParameters("The course is invalid"));
        }
        return new Right(undefined);
    }

    static validateKeyWords(keyWords: string[]): Either<DomainError, void> {
        if (!keyWords || keyWords.length === 0) {
            return new Left(AcademicWorkErros.InvalidParameters("At least one keyword is required"));
        }
        return new Right(undefined);
    }

    static validateTitle(title: string): Either<DomainError, void> {
        if (!title || title.trim().length === 0) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "A title has invalid"
                )
            );
        };
        return new Right(undefined);
    }

    static validateYear(year: number): Either<DomainError, void> {
        if (year < 1900 || year > new Date().getFullYear()) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The year has invalid"
                )
            );
        }
        return new Right(undefined);
    }

    static validateqtdPag(qtdPag: number): Either<DomainError, void> {
        if (qtdPag <= 0) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The qtd has invalid"
                )
            );
        }
        return new Right(undefined);
    }

    static validateAuthors(authors: Author[]): Either<DomainError, void> {
        if (authors.length === 0) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The authors has invalid"
                )
            );
        }
        return new Right(undefined);
    }

    static validateUrl(url?: string): Either<DomainError, void> {
        if (!url)
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The URL is invalid"
                )
            );
        try {
            new URL(url); // Tenta criar um objeto URL para validar
            return new Right(undefined);
        } catch {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The URL is invalid"
                )
            );
        }
    }

    static validateCutterNumber(cutterNumber?: string): Either<DomainError, void> {

        if (!cutterNumber || !/^[A-Z]\d{3}$/i.test(cutterNumber)) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The Cutter Number is invalid"
                )
            );
        }
        return new Right(undefined);
    }

    static validateCduCode(cduCode?: string): Either<DomainError, void> {
        if (!cduCode || !/^\d+(\.\d+)*$/.test(cduCode)) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The CDU Code is invalid"
                )
            );
        }

        return new Right(undefined);
    }

    static validateCddCode(cddCode?: string): Either<DomainError, void> {
        if (!cddCode || !/^\d+(\.\d+)*$/.test(cddCode)) {
            return new Left(
                AcademicWorkErros.InvalidParameters(
                    "The CDD Code is invalid"
                )
            );
        }

        return new Right(undefined);
    }

    static validateChangeVisibility(props: academicWorkProps): Either<DomainError, void> {
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
            AcademicWorkValitador.validateUrl(props.url),
            AcademicWorkValitador.validateCutterNumber(props.cutterNumber),
            AcademicWorkValitador.validateCduCode(props.cduCode),
            AcademicWorkValitador.validateCddCode(props.cddCode)
        ]
            .filter((error): error is Left<DomainError, void> => error.isLeft())
            .map((error) => error.value.details)
            .flat();

        if (errorList.length > 0)
            return new Left(AcademicWorkErros.InvalidChangeVisibility(errorList.join("\n")));
        return new Right(undefined);
    }

}
