export interface AdvisorProps {
    name: string,
    surname: string
    registrationNumber: string
    // desc?: string,
    // link?: string,
    // areasOfExpertise?: string[],  // Áreas de expertise do orientador
    // publications?: string[],      // Links para publicações relevantes
    // department?: string,           // Departamento ou instituição onde o orientador atua
}


export class Advisor {
    private _id: string;

    constructor(private _props: AdvisorProps, id?: string) {
        this._id = id || crypto.randomUUID();
    }
    //====================================================================
    //                              Setters
    setRegistrationNumber(registrationNumber: string) {
        this._props.registrationNumber = registrationNumber;
    }
    setName(name: string) {
        this._props.name = name;
    }
    setSurname(surname: string) {
        this._props.surname = surname;
    }

    //====================================================================
    get id(): string {
        return this._id;
    }
    get props(): AdvisorProps {
        return this._props;
    }
    get name(): string {
        return this._props.name;
    }
    get surname(): string {
        return this._props.surname;
    }
    get registrationNumber(): string {
        return this._props.registrationNumber
    }
}