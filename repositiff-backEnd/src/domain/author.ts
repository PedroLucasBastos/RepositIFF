export type authorsProps = {
    registrationNumber: number,
    name: string,
    surName: string,
}

export class Author {
    private _id: string;
    private _props: authorsProps;
    constructor(props: authorsProps, id?: string) {
        this._id = id || crypto.randomUUID();
        this._props = props;
    }
}