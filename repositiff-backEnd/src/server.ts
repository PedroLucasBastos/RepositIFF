import fastify from 'fastify';
import cors from '@fastify/cors'
import appRoutes from "@src/routes.js"

import * as dotenv from 'dotenv';

dotenv.config();
const app = fastify();
const PORT = process.env.PORT || 1111;

// Configura o CORS
app.register(cors, {
    origin: [process.env.URL_ACCEPTED || ""], // Permitir requisições apenas desta origem
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
    allowedHeaders: ['Content-Type', 'Authorization'], // Cabeçalhos permitidos
});


app.get('/', () => {
    // console.log("Hello World")
    return "Hello World";
})

// Registra todas as rotas do sistema
app.register(appRoutes);

app.listen({
    port: Number(PORT),
}).then(() => {
    console.log(`Http Server running in PORT -> ${PORT}`)
    // console.log(`postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PW}@localhost:5432/${process.env.POSTGRES_DB}?schema=public`)
    // console.log(`Olá:     ${process.env.DATABASE_URL}`)
})