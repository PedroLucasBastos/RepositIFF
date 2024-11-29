import { Either } from "@src/error_handling/either.js";
import { academicWorkProps } from "../academicWork.js";
import { ErrorsParameters } from "@src/error_handling/domainServicesErrors.js";
import { AcademicWork } from "@prisma/client";

export class AcademicWorkFactory {
    static create(props: academicWorkProps): Either<ErrorsParameters | AcademicWork> {

    }
}