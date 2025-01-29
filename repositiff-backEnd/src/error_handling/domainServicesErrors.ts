export enum ErrorCategory {
    Domain = "DomainError",
    Application = "ApplicationError",
    Persistence = "PersistenceError"
}

export class DomainError extends Error {
    private readonly _details: string;
    private readonly _code?: string;
    private readonly _cause?: Error;

    constructor(category: ErrorCategory, message: string, details: string, cause?: Error, code?: string) {
        super(message);
        this.name = category;
        this._details = details;
        this._cause = cause;
        this._code = code;
    }


    get code(): undefined | string {
        return this._code;
    }

    get cause(): undefined | Error {
        return this._cause;
    }

    get category(): string {
        return this.name;
    }

    get message(): string {
        return this.message;
    }

    get details(): string {
        return this._details;
    }

    get show() {
        return {
            category: this.name,
            message: this.message,
            details: this._details,
        };
    }
}
