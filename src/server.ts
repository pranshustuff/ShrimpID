import Fastify from "fastify"

const app = Fastify();

type LoginBody = {
    user: string,
    pass: string
};

app.get("/", async() => {
    return {hello: "world"};
});

app.post("/login", async (req, reply) => {
    const data = req.body as LoginBody;

    if (data.user == "Hello" && data.pass == "hi"){
        return {status: "Success"};
    } else {
        return {status: "Failed"};
    }
});

const start = async () => {
    try {
        await app.listen({port:3000});
        console.log("Server Running on port 3000");
    } catch(err) {
        console.log(err);
        process.exit(1);
    }
};

start();