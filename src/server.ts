import Fastify, { fastify } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
dotenv.config()

const app = Fastify()

type Credentials = {
    username: string,
    password: string
}

type StoredUser = {
    username: string,
    password: string
}

const users: StoredUser[] = []

const secret = process.env.ACCESS_TOKEN_SECRET as string

app.get("/", async() => {
    return {hello: "world"}
})

app.post("/signup", async (req, res) => {
    const {username, password} = req.body as Credentials
    const hash = await bcrypt.hash(password, 11)

    users.push({
        username, 
        password:hash
    })
    
    console.log("User Saved.")
    res.send('ok')
})

app.post("/login", async (req, res) => {
    const {username, password} = req.body as Credentials

    const user = users.find(u => u.username == username)
    if(!user){
        res.send("No user found.")
        return
    }
    const isValid = await bcrypt.compare(password, user.password)

    if(!isValid){
        res.send("Wrong Password")
        return
    }

    const token = jwt.sign({username:username}, secret, {expiresIn: 60*60})

    res.send({accessToken: token})
})

interface AuthRequest extends Fastify.FastifyRequest {
    user?: {
        username: string
        iat: number
        exp: number
    }
}

async function authenticateToken(req: AuthRequest, res: Fastify.FastifyReply): Promise<void> {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if(token==null) return res.status(401).send("Unauthorized")
    
    try {
        const user = jwt.verify(token, secret) as AuthRequest["user"]
        req.user = user
    } catch(err) {
        return res.status(403).send("Forbidden")
    }
}

app.get("/me", async(req: AuthRequest, res) => {
    await authenticateToken(req, res)
    if(res.statusCode >= 400) return
    if(!req.user) return res.status(401).send("Unauthorized")
    res.send({username: req.user.username})
})

const start = async () => {
    try {
        await app.listen({port:3000})
        console.log("Server Running on port 3000")
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

start()