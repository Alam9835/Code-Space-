
const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const bodyParser = require('body-parser');
const compiler=require('compilex');

const server = http.createServer(app);
const io = new Server(server);


 app.use(express.static('build'));




app.use(bodyParser());
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});


const option = { stats: true };
compiler.init(option);
app.get("/", function (req, res) {
  res.sendfile(__dirname + "/pages/EditorPage.js");
});

const userSocketMap = {};
function getAllConnectedClients(roomId) {
    // Map
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        socket.join(roomId);
        const clients = getAllConnectedClients(roomId);
        clients.forEach(({ socketId }) => {
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

    socket.on('disconnecting', () => {
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
        socket.leave();
    });
});


app.post("/compilecode", function (req, res) {
    var code = req.body.code;
    var input = req.body.input;
    var inputRadio = req.body.inputRadio;
    var lang = req.body.lang;
    if (lang === "C" || lang === "C++") {
      if (inputRadio === "true") {
        var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
        compiler.compileCPPWithInput(envData, code, input, function (data) {
          if (data.error) {
            res.send(data.error);
          } else {
            res.send(data.output);
          }
        });
      } else {
        var envData = { OS: "windows", cmd: "g++", options: { timeout: 10000 } };
        compiler.compileCPP(envData, code, function (data) {
          res.send(data);
          //data.error = error message
          //data.output = output value
        });
      }
    }
    if (lang === "Python") {
      if (inputRadio === "true") {
        var envData = { OS: "windows" };
        compiler.compilePythonWithInput(envData, code, input, function (data) {
          res.send(data);
        });
      } else {
        var envData = { OS: "windows" };
        compiler.compilePython(envData, code, function (data) {
          res.send(data);
        });
      }
    }
  });
  
  
  app.get("/fullStat", function (req, res) {
    compiler.fullStat(function (data) {
      res.send(data);
    });
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));

compiler.flush(function () {
    console.log("All temporary files flushed !");
  });