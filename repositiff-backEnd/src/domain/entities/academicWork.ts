import * as crypto from "crypto";
import { Advisor } from "@src/domain/entities/advisor.js";
import { Course } from "@src/domain/entities/course.js";
import { Either, Left, Right } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { AcademicWorkValitador } from "./validators/academicWorkFValidate.js";
import { Author } from "./author.js";

// export type author = {
//     nome: string;
//     sobrenome: string;
// }

export enum academicWorkVisibility {
    Public = "public",
    Private = "private"
}

export enum typeWork {
    Undergraduate = "Undergraduate thesis"
}

export enum illustration {
    NOT = "Does not have",
    COLOR = "Colorful",
    MONOCHROME = "Black and white"
}

export interface academicWorkProps {
    authors: Author[],
    advisors: Advisor[],
    title: string,
    typeWork: typeWork,
    year: number,
    qtdPag: number,
    description: string,
    course: Course,
    keyWords: string[],
    illustration: illustration,
    references: number[],
    url?: string,
    cutterNumber?: string,
    cduCode?: string,
    cddCode?: string,
}

export class AcademicWork {
    private _id: string;
    private _academicWorkVisibility: academicWorkVisibility;
    private constructor(
        private _props: academicWorkProps,
        id?: string,
    ) {
        this._id = id || crypto.randomUUID();
        this._academicWorkVisibility = academicWorkVisibility.Private;
    }

    static createAcademicWorkFactory(props: academicWorkProps): Either<DomainError, AcademicWork> {
        const result = AcademicWorkValitador.validateInitiateProps(props);
        if (result.isLeft())
            return new Left(result.value);
        return new Right(new AcademicWork(props));
    }

    public changeVisibility(): void {
        if (this._academicWorkVisibility === academicWorkVisibility.Public)
            this._academicWorkVisibility = academicWorkVisibility.Private;
        if (
            this._academicWorkVisibility === academicWorkVisibility.Private
            &&
            AcademicWorkValitador.validateChangeVisibility(this._props).isRight()
        ) {
            this._academicWorkVisibility === academicWorkVisibility.Private
        }
    }

    // Getters
    public getId(): string {
        return this._id;
    }
    public getAuthors(): Author[] {
        return this._props.authors;
    }

    public getAdvisors(): Advisor[] {
        return this._props.advisors;
    }

    public getTitle(): string {
        return this._props.title;
    }

    public getTypeWork(): string {
        return this._props.typeWork;
    }

    public getYear(): number {
        return this._props.year;
    }

    public getQtdPag(): number {
        return this._props.qtdPag;
    }

    public getDescription(): string {
        return this._props.description;
    }

    public getCourse(): Course {
        return this._props.course;
    }

    public getKeyWords(): string[] {
        return this._props.keyWords;
    }

    public getCutterNumber(): string | void {
        return this._props.cutterNumber;
    }

    public getCduCode(): string | void {
        return this._props.cduCode;
    }

    public getCddCode(): string | void {
        return this._props.cddCode;
    }

    get getUrl(): string | void {
        return this._props.url;
    }

    public setUrl(url: string): void {
        this._props.url = url;
    }

    public getacademicWorkStatus(): string {
        return this._academicWorkVisibility;
    }
}