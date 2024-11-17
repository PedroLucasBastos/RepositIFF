import { Author } from "@prisma/client";
import { Address } from "cluster";
import * as crypto from "crypto";
import { Advisor } from "@src/domain/advisor.js";
export type author = {
    nome: string;
    sobrenome: string;
}
// export type advisor = {
//     nome: string;
//     sobrenome: string;
// }


type academicWorkProps = {
    id?: string,
    createdAt?: string,
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
    status?: boolean
}
export class TrabalhoAcademico {
    private _id: string;
    private _createdAt: string;
    private _authors: author[];
    private _advisors: Advisor[];
    private _title: string;
    private _typeWork: string;
    private _year: number;
    private _qtdPag: number;
    private _description: string;
    private _course: string;
    private _keyWords: string[];
    private _cutterNumber: string;
    private _cduCode: string;
    private _cddCode: string;
    private _url: string;
    private _status: boolean;

    constructor(
        props: academicWorkProps
    ) {
        this._id = props.id || crypto.randomUUID();
        this._createdAt = props.createdAt || new Date().toString();

        // Atribuindo valores diretamente
        this._status = props.status || false;
        this._url = props.url || "";
        this._cutterNumber = props.cutterNumber || "";
        this._cduCode = props.cduCode || "";
        this._cddCode = props.cddCode || "";

        // Atribuindo os parâmetros obrigatórios
        this._authors = props.authors;
        this._advisors = props.advisors;
        this._title = props.title;
        this._typeWork = props.typeWork;
        this._year = props.year;
        this._qtdPag = props.qtdPag;
        this._description = props.description;
        this._course = props.course;
        this._keyWords = props.keyWords;
    }

    // Getters
    public getId(): string {
        return this._id;
    }

    public getCreatedAt(): string {
        return this._createdAt;
    }

    public getAuthors(): author[] {
        return this._authors;
    }

    public getAdvisors(): Advisor[] {
        return this._advisors;
    }

    public getTitle(): string {
        return this._title;
    }

    public getTypeWork(): string {
        return this._typeWork;
    }

    public getYear(): number {
        return this._year;
    }

    public getQtdPag(): number {
        return this._qtdPag;
    }

    public getDescription(): string {
        return this._description;
    }

    public getCourse(): string {
        return this._course;
    }

    public getKeyWords(): string[] {
        return this._keyWords;
    }

    public getCutterNumber(): string {
        return this._cutterNumber;
    }

    public getCduCode(): string {
        return this._cduCode;
    }

    public getCddCode(): string {
        return this._cddCode;
    }

    public getUrl(): string {
        return this._url;
    }

    public getStatus(): boolean {
        return this._status;
    }
}