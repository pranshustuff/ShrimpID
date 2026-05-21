import Fastify from "fastify";
import dotenv from "dotenv";
import { AuthRequest } from "./auth/types.js";
import { authenticateToken } from "./auth/verify.js";

dotenv.config();

const app = Fastify()

app.get("/me", async(req: AuthRequest, res) => {
    await authenticateToken(req, res)
    if(res.statusCode >= 400) return
    if(!req.user) return res.status(401).send("Unauthorized")
    res.send({username: req.user.username})
})

const start = async () => {
    try {
        await app.listen({port:4000})
        console.log("Server Running on port 4000")
    } catch(err) {
        console.log(err)
        process.exit(1)
    }
}

start()