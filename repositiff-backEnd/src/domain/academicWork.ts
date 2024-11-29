import * as crypto from "crypto";
import { Advisor } from "@src/domain/advisor.js";

export type author = {
    nome: string;
    sobrenome: string;
}

export enum academicWorkStatus {
    Public = "public",
    Private = "private"
}


export interface academicWorkProps {
    authors: author[],
    advisors: Advisor[],
    title: string,
    typeWork: string,
    year: number,
    qtdPag: number,
    description: string,
    course: string,
    keyWords: string[],
    url?: string,
    cutterNumber?: string,
    cduCode?: string,
    cddCode?: string,
}


export class TrabalhoAcademico {
    private _id: string;
    private _academicWorkStatus: academicWorkStatus;
    constructor(
        private _props: academicWorkProps,
        id?: string,
        academicWorkStatusParams?: academicWorkStatus
    ) {
        this._id = id || crypto.randomUUID();
        this._academicWorkStatus = academicWorkStatusParams || academicWorkStatus.Private;
    }

    // Getters
    public getId(): string {
        return this._id;
    }
    public getAuthors(): author[] {
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

    public getCourse(): string {
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
        return this._academicWorkStatus;
    }
}