export type AuthorsProps = {
    registrationNumber: number,
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
}