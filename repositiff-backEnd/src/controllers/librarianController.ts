import { Librarian, librarianProps } from "@src/domain/entities/librarian.js";
import { BcryptService } from "@src/infra/security/bcryptService.js";
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaLibrarianRepository } from "@src/infra/repositories/prisma/prisma-librarian-respository.js"
import { JWTService } from "@src/infra/security/jwtService.js";

// Interface para o corpo da requisição
export interface RegisterLibrarianRegisterBody {
    name: string;
    email: string;
    registrationNumber: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterLibrarianLoginBody {
    registrationNumber: string,
    password: string
}

export interface HeadersLibrarian {
    authorization: string
}

export class LibrarianController {
    private _bcrypt: BcryptService;
    private _librarianRepository: PrismaLibrarianRepository;
    private _jwtService: JWTService | undefined;

    constructor(
        // bcryptService: BcryptService = new BcryptService(),
        // librarianRepository: PrismaLibrarianRepository = new PrismaLibrarianRepository()
    ) {
        this._bcrypt = new BcryptService();
        this._librarianRepository = new PrismaLibrarianRepository();
    }

    async register(req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, res: FastifyReply): Promise<void> {
        const { name, email, registrationNumber, password, confirmPassword } = req.body;

        // validations
        if (!name) {
            return res.status(422).send({ msg: "O nome é obrigatório!" });
        }

        if (!email) {
            return res.status(422).send({ msg: "O email é obrigatório!" });
        }

        if (!registrationNumber) {
            return res.status(422).send({ msg: "O número de matricula é obrigatório!" });
        }

        if (!password) {
            return res.status(422).send({ msg: "A senha é obrigatória!" });
        }

        if (password != confirmPassword) {
            return res
                .status(422)
                .send({ msg: "A senha e a confirmação precisam ser iguais!" });
        }

        // Verifica se o email já existe
        const existingLibrarian = await this._librarianRepository.findByEmail(email);
        if (existingLibrarian) {
            res.code(409).send({ message: 'Email already in use' });
            return;
        }
        // Cria o hash da senha
        const passwordHash = await this._bcrypt.hashPassword(password);

        // Cria o novo bibliotecário
        const newLibrarian = new Librarian({
            name,
            email,
            registrationNumber,
            password: passwordHash,
        });
        // Salva no banco de dados
        await this._librarianRepository.newLibrarian(newLibrarian);

        res.code(201).send({ message: 'Librarian registered successfully' });
    }

    async login(req: FastifyRequest<{ Body: RegisterLibrarianRegisterBody }>, res: FastifyReply): Promise<void> {
        const { registrationNumber, password } = req.body;
        if (!registrationNumber) {
            return res.status(422).send({ msg: "O número de matricula é obrigatório!" });
        }
        if (!password) {
            return res.status(422).send({ msg: "A senha é obrigatória!" });
        }

        const librarian = await this._librarianRepository.findByRegistrationNumber(registrationNumber);

        const isLibrarianInvalid = !librarian;
        const isPasswordInvalid = librarian && !(await this._bcrypt.comparePasswords(password, librarian.pass));

        if (isLibrarianInvalid || isPasswordInvalid) {
            return res.status(422).send({ msg: "Usuário ou senha não estão corretos" });
        }

        try {
            const jwtSecret = process.env.SECRET || ''
            this._jwtService = new JWTService(jwtSecret, "8h");

            const token = this._jwtService.generateToken({ id: librarian.id });
            return res.status(200).send({
                name: librarian.name,
                token: token
            })
        } catch (error) {
            return res.status(422).send({ msg: "Erro ao gerar o token" });
        }

    }

    // async validateLibarian(req: FastifyRequest<{ Headers: HeadersLibrarian }>): Promise<void> {
    //     console.log(req.headers);

    // }

    async listLibrarians(req: any, res: FastifyReply): Promise<void> {
        const jwtSecret = process.env.SECRET || ''
        const token = req.authorization.split(" ")[1];
        JWTService.verifyToken(token, jwtSecret);
        const listLibrarians = await this._librarianRepository.listAll();
        return res.status(200).send(listLibrarians);
    }
}