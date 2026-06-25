let io = null;

const initSocket = (server) => {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: {
      origin: [/^http:\/\/localhost:\d+$/, process.env.FRONTEND_URL].filter(Boolean),
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.handshake.auth?.userId;
    if (userId) {
      socket.join(`user:${userId}`);
    }
    socket.on('disconnect', () => {});
  });

  return io;
};

const emitToUser = (userId, event, payload) => {
  if (!io || !userId) return;
  io.to(`user:${userId}`).emit(event, payload);
};

const getIO = () => io;

module.exports = { initSocket, emitToUser, getIO };
