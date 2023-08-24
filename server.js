const express = require('express');
const app = express();
require('dotenv').config();
const dbConfig = require("./config/dbConfig");
const bodyParser = require('body-parser');
const socket = require("socket.io");

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());
const userRoute = require("./routes/userRoute");
const adminRoute = require("./routes/adminRoute");
const doctorRoute = require("./routes/doctorRoute");
const uploadRoute = require('./routes/uploadRoute');
const messageRoute = require("./routes/messageRoute");

app.use("/api/user", userRoute);
app.use("/api/admin", adminRoute);
app.use("/api/doctor", doctorRoute);
app.use("/api/messages", messageRoute);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => console.log(`Node server started at port ${port}`));


const io = socket(server);



app.use('/api/upload', uploadRoute);


let onlineUsers = new Map();
io.on("connection", (socket) => {
    chatSocket = socket;
    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
    });

    socket.on("send-message", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("recieve-message", data.msg);
        }
    });
});