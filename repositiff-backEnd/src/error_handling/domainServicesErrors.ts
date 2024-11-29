export enum ErrorCategory {
    Domain = "DomainError",
    Application = "ApplicationError"
}

export class DomainError extends Error {
    private readonly _descriptionError: string[];

    constructor(category: ErrorCategory, message: string, descriptionError: string[]) {
        super(message);
        this.name = category;
        this._descriptionError = descriptionError;
        // Object.setPrototypeOf(this, new.target.prototype); // Corrige o prototype para instanceof funcionar corretamente
    }

    get category(): string {
        return this.name;
    }

    get details(): string[] {
        return this._descriptionError;
    }

    get show() {
        return {
            category: this.name,
            message: this.message,
            details: this._descriptionError
        };
    }
}
