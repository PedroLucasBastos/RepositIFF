import { DomainError } from "./domainServicesErrors.js";

export abstract class EitherOO<L, R> {
    static left(arg0: DomainError): EitherOO<import("./domainServicesErrors.js").DomainError, true> {
        throw new Error("Method not implemented.");
    }
    abstract value: L | R;
    abstract isLeft(): this is Left<L, R>;
    abstract isRight(): this is Right<L, R>;
}
export class Left<L, R> extends EitherOO<L, R> {

    constructor(public value: L) {
        super(); // Chama o construtor da classe base (Either).
        this.value = value; // Armazena o valor do erro.
    }

    // Retorna true porque é uma instância de Left
    // Garante ao TypeScript que é `Left` com um valor do tipo `L`.
    isLeft(): this is Left<L, R> {
        return true;
    }

    // Garante ao TypeScript que NÃO é um `Right`.
    isRight(): this is Right<L, R> {
        return false;
    }
    // getValue(): L | R {
    //     return this.value;
    // }
}

export class Right<L, R> extends EitherOO<L, R> {
    // readonly value: R;

    constructor(public value: R) {
        super();
    }

    isLeft(): this is Left<L, R> {
        return false;
    }

    isRight(): this is Right<L, R> {
        return true;
    }

    // getValue(): L | R {
    //     return this.value;
    // }
}
