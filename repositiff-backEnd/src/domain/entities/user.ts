export type userProps = {
  name: string;
  email: string;
  role: Role;
  registrationNumber: string;
  password: string;
};

export enum Role {
  ADMIN = "ADMIN",
  LIBRARIAN = "LIBRARIAN",
}
export class User {
  private _id: string;
  private _props: userProps;
  constructor(props: userProps, id?: string) {
    this._id = id || crypto.randomUUID();
    this._props = props;
  }

  // static createUserFactory(props: userProps, id?: string): User {
  //   return new User(props, id);
  // }

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
