import * as crypto from "crypto";
import { Advisor } from "@src/domain/entities/advisor.js";
import { Course } from "@src/domain/entities/course.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { AcademicWorkValitador } from "./validators/academicWorkFValidate.js";
import { Author } from "./author.js";
import { AcademicWorkFile } from "./academicWorkFile.js";

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

export enum Illustration {
    NOT = "Does not have",
    COLOR = "Colorful",
    MONOCHROME = "Black and white"
}


export interface academicWorkProps {
    authors: string[],
    advisors: Advisor[],
    title: string,
    year: number,
    qtdPag: number,
    description: string,
    course: Course,
    typeWork: typeWork,
    keyWords: string[],
    illustration: Illustration,
    references: number[],
    file?: string,
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
        academicWorkStatus?: academicWorkVisibility,
    ) {
        this._id = id || crypto.randomUUID();
        this._academicWorkVisibility = academicWorkStatus ?? academicWorkVisibility.Private;
    }

    static createAcademicWorkFactory(props: academicWorkProps, id?: string, academicWorkStatus?: academicWorkVisibility): EitherOO<DomainError, AcademicWork> {
        const result = AcademicWorkValitador.validateInitiateProps(props);
        if (result.isLeft())
            return new Left(result.value);
        return new Right(new AcademicWork(props, id, academicWorkStatus));
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

    public set file(file: string) {
        this._props.file = file;
    }

    // Getters

    public get ilustration(): Illustration {
        return this._props.illustration;
    }

    public get status(): academicWorkVisibility {
        return this._academicWorkVisibility;
    }

    public get id(): string {
        return this._id;
    }
    public get authors(): string[] {
        return this._props.authors;
    }

    public get advisors(): Advisor[] {
        return this._props.advisors;
    }

    public get title(): string {
        return this._props.title;
    }

    public get typeWork(): string {
        return this._props.typeWork;
    }

    public get year(): number {
        return this._props.year;
    }

    public get qtdPag(): number {
        return this._props.qtdPag;
    }

    public get description(): string {
        return this._props.description;
    }

    public get course(): Course {
        return this._props.course;
    }

    public get keyWords(): string[] {
        return this._props.keyWords;
    }

    public get cutterNumber(): string | undefined {
        return this._props.cutterNumber;
    }

    public get cduCode(): string | undefined {
        return this._props.cduCode;
    }

    public get cddCode(): string | undefined {
        return this._props.cddCode;
    }

    get file(): string | undefined {
        return this._props.file;
    }

    // public setUrl(newFile: string): void {
    //     this._props.file = url;
    // }

    public get academicWorkStatus(): academicWorkVisibility {
        return this._academicWorkVisibility;
    }

    public get references(): number[] {
        return this._props.references;
    }
}