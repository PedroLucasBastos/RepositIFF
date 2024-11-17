import { Librarian, librarianProps } from "@src/domain/librarian.js";
import { BcryptService } from "@src/infra/security/bcryptService.js";
import { FastifyRequest, FastifyReply } from 'fastify';
import { PrismaLibrarianRepository } from "@src/repositories/prisma-librarian-respository.js"

// Interface para o corpo da requisição
export interface RegisterLibrarianRegisterBody {
    name: string;
    email: string;
    registrationNumber: string;
    password: string;
    confirmPassword: string;
}

export interface RegisterLibrarianLoginBody {
    email: string,
    password: string
}

export class LibrarianController {
    private _bcrypt: BcryptService;
    private _librarianRepository: PrismaLibrarianRepository;

    constructor(
        bcryptService: BcryptService = new BcryptService(),
        librarianRepository: PrismaLibrarianRepository = new PrismaLibrarianRepository()
    ) {
        this._bcrypt = bcryptService;
        this._librarianRepository = librarianRepository;
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

    }
}