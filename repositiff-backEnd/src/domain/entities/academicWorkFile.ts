

interface IFileProps {
    title: string;
    key?: string;
    url?: string;
}

export class AcademicWorkFile {
    private _id: string;
    private _updateAt: string;
    private _createdAt: string;

    constructor(
        private _props: IFileProps,
        id?: string
    ) {
        this._id = id || crypto.randomUUID();
        this._createdAt = Date.now().toString();
        this._updateAt = Date.now().toString();
    }

    public get key(): string | undefined {
        return this._props.key;
    }

    get id(): string {
        return this._id;
    }

    public get title(): string {
        return this._props.title;
    }

    public get createdAt(): string {
        return this._createdAt;
    }

    public get updateAt(): string {
        return this._updateAt;
    }

    public updateFile(): void {
        this._updateAt = Date.now().toString();
    }

}