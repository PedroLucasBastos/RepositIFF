export type AuthorsProps = {
    registrationNumber: string,
    name: string,
    surName: string,
}

export class Author {
    private _id: string;
    private _props: AuthorsProps;
    constructor(props: AuthorsProps, id?: string) {
        this._id = id || crypto.randomUUID();
        this._props = props;
    }

    public get id(): string {
        return this._id;
    }
    public get props(): AuthorsProps {
        return this._props;
    }

    public get name(): string {
        return this._props.name;
    }

    public get surname(): string {
        return this._props.surName;
    }

    public get registrationNumber(): string {
        return this._props.registrationNumber;
    }
}