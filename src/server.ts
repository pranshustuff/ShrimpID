import Fastify from "fastify"

const app = Fastify({
    logger:true
});

app.get("/", async() => {
    return {hello: "world"};
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