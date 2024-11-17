import bcrypt from "bcrypt";

export class BcryptService {
    private readonly saltRounds: number;
    constructor() {
        this.saltRounds = 12;
    }

    // Gera o hash da senha, incluindo a geração do salt
    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.saltRounds);
        return bcrypt.hash(password, salt);
    }

    // Compara a senha com o hash
    async comparePasswords(plainPassword: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(plainPassword, hashedPassword);
    }
}
