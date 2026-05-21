import Fastify from "fastify";

export type Credentials = {
    username: string,
    password: string
}

export type StoredUser = {
    username: string,
    password: string
}

export interface AuthRequest extends Fastify.FastifyRequest {
    user?: {
        username: string
        iat: number
        exp: number
    }
}