import io from "socket.io-client";
const sendNotification = (userId: string, message: string) => {
  const socket = io(`http://localhost:4000`);

  socket.emit("message", { userId: `${userId}`, message });
};
export { sendNotification };
