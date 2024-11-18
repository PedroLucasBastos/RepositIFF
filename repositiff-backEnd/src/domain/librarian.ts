export type librarianProps = {
    name: string,
    email: string,
    registrationNumber: string,
    password: string,
}
export class Librarian {
    private _id: string;
    private _props: librarianProps;
    constructor(
        props: librarianProps,
        id?: string
    ) {
        this._id = id || crypto.randomUUID();
        this._props = props;
    }



    // set password(pass: string) {
    //     this._props.pass = pass;
    // }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this._props.name;
    }
    get email(): string {
        return this._props.email;
    }
    get registrationNumber(): string {
        return this._props.registrationNumber;
    }
    get pass(): string {
        return this._props.password;
    }
}