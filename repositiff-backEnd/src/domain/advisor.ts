export type AdvisorProps = {
    nome: string,
    sobrenome: string,
    numMatricula: number,
    desc?: string,
    link?: string,
    // cpf: string
}

export class Advisor {
    private _id: string;
    sobrenome: any;
    constructor(private _props: AdvisorProps, id?: string) {
        this._id = id || crypto.randomUUID();

    }
    get props(): AdvisorProps {
        return this._props;
    }
    get nome(): string {
        return this._props.nome;
    }
}