module.exports = () => {

    let KEY_FILE = path.join(__dirname, process.env.KEY_FILE),
    CRT_FILE = path.join(__dirname, process.env.CRT_FILE);
    console.log("KEY_FILE : ", KEY_FILE);
    console.log("CRT_FILE : ", CRT_FILE);
    console.log("fs.existsSync(KEY_FILE) : ", fs.existsSync(KEY_FILE));
    console.log("fs.existsSync(CRT_FILE) : ", fs.existsSync(CRT_FILE));
    if (fs.existsSync(KEY_FILE) && fs.existsSync(CRT_FILE)) {
        let options = {
            key: fs.readFileSync(KEY_FILE),
            cert: fs.readFileSync(CRT_FILE),
        };
        console.log("creating https app");
        server = https.createServer(options, app);
        IsHttpS = true;
    } else{
        console.log("creating http app");
        server = http.createServer(app);
        IsHttpS = false;
    }

    io = socketIO(server, {
        transports: ["websocket", "polling", "xhr-polling", "flashsocket"],
        pingInterval: 25000, // to send ping/pong events for specific interval (milliseconds)
        pingTimeout: 30000, // if ping is not received in the "pingInterval" seconds then milliseconds will be disconnected in "pingTimeout" milliseconds,
        allowEIO3: true,
        maxHttpBufferSize: 1e7 //10 MB
    });

    io.sockets.on("connection", async function (client) {
        client.on("request", async function (msg, cb) {

            var { event, data } = msg;

            let service = rootServices[event];

            const callHandler = () =>
                new Promise((resolve, reject) => {
                    return service
                        .handler(data, client)
                        .then(resolve)
                        .catch(reject);
                });
            return callHandler().then((data)=>{
                client.emit("response", { result : data });
            })
        })
    })
}