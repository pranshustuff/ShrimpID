import Fastify, { fastify } from "fastify"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import * as dotenv from "dotenv"
import { Credentials, StoredUser } from "./types.js"
import fs from "fs";
dotenv.config()

const app = Fastify()

const users: StoredUser[] = []

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
    const secret = fs.readFileSync("./certs/private.pem");

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

    const token = jwt.sign(
        {username:username}, 
        secret, 
        {expiresIn: 10*60, algorithm:"RS256"}
    )

    res.send({accessToken: token})
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