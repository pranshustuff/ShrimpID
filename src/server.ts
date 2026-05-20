import Fastify from "fastify"
import bcrypt from "bcrypt"

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

    res.send('ok')
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