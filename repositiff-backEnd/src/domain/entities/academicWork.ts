import * as crypto from "crypto";
import { Advisor } from "@src/domain/entities/advisor.js";
import { Course } from "@src/domain/entities/course.js";
import { EitherOO, Left, Right } from "@src/error_handling/either.js";
import { DomainError } from "@src/error_handling/domainServicesErrors.js";
import { AcademicWorkValitador } from "./validators/academicWorkFValidate.js";
import { Author } from "./author.js";
import { CutterTable } from "../services/cutterNumber.js";
// import { CutterNumberService } from "@src/domain/services/cutterNumberService.js";

// export type author = {
//     nome: string;
//     sobrenome: string;
// }

export enum academicWorkVisibility {
  Public = "public",
  Private = "private",
}

export enum typeWork {
  Undergraduate = "Undergraduate thesis",
}

export enum Illustration {
  NOT = "Does not have",
  COLOR = "Colorful",
  MONOCHROME = "Black and white",
}

export interface academicWorkProps {
  authors: string[];
  advisors: Advisor[];
  title: string;
  year: number;
  qtdPag: number;
  description: string;
  course: Course;
  typeWork: typeWork;
  keyWords: string[];
  illustration: Illustration;
  // cutterNumber?: string;
  references: number[];
  // file?: string;
  cduCode?: string;
  cddCode?: string;
}

export class AcademicWork {
  private _id: string;
  private _academicWorkVisibility: boolean;
  private _file: string;
  private _cutterNumber: string;

  private constructor(
    private _props: academicWorkProps,
    id?: string,
    academicWorkStatus?: boolean,
    cutterNumber?: string,
    file?: string
  ) {
    this._id = id || crypto.randomUUID();
    this._file = file || crypto.randomUUID();
    this._academicWorkVisibility = academicWorkStatus ?? false;
    this._cutterNumber =
      cutterNumber || new CutterTable().generateCutterNumber(this._props.authors[0], this._props.title);
    // this._props.cutterNumber = await this.generateCutterNumber(this._props.authors[0], this._props.title);
  }

  static createAcademicWorkFactory(
    props: academicWorkProps,
    id?: string,
    academicWorkStatus?: boolean,
    cutterNumber?: string,
    file?: string
  ): EitherOO<DomainError, AcademicWork> {
    const result = AcademicWorkValitador.validateInitiateProps(props);

    if (result.isLeft()) return new Left(result.value);
    return new Right(new AcademicWork(props, id, academicWorkStatus, cutterNumber));
  }

  // public changeVisibility(): void {
  //   if (this._academicWorkVisibility === academicWorkVisibility.Public)
  //     this._academicWorkVisibility = academicWorkVisibility.Private;
  //   if (
  //     this._academicWorkVisibility === academicWorkVisibility.Private &&
  //     AcademicWorkValitador.validateChangeVisibility(this._props).isRight()
  //   ) {
  //     this._academicWorkVisibility === academicWorkVisibility.Private;
  //   }
  // }

  // public set file(file: string) {
  //     this._props.file = file;
  // }

  // Getters

  public get ilustration(): Illustration {
    return this._props.illustration;
  }

  public get status(): boolean {
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

  public get cutterNumber(): string {
    return this._cutterNumber;
  }

  public get cduCode(): string | undefined {
    return this._props.cduCode;
  }

  public get cddCode(): string | undefined {
    return this._props.cddCode;
  }

  get file(): string {
    return this._file;
  }

  // public setUrl(newFile: string): void {
  //     this._props.file = url;
  // }

  public get academicWorkStatus(): boolean {
    return this._academicWorkVisibility;
  }

  public get references(): number[] {
    return this._props.references;
  }
}
