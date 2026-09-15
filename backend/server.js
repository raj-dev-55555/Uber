const http = require("http");//Ye server banane ka low-level way deta hai.Express internally isi HTTP functionality ke upar kaam karta hai.
const app = require("./app");
const port = process.env.port||3000;
const { initializeSocket } = require('./socket');


const server = http.createServer(app);

initializeSocket(server);


server.listen(port,()=>{
    `server is running on port ${port}`;
})