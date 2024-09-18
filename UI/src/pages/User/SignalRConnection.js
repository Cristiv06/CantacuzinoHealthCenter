import * as signalR from "@microsoft/signalr";
import userSession from "../../utils/userSession";

const userId = userSession.user()?.id;
console.log(userId);
const connection = new signalR.HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_API_URL}/notificationhub?userId=${userId}`)
  .withAutomaticReconnect()
  .build();
export const startConnection = async () => {
  try {
    if (connection.state === signalR.HubConnectionState.Disconnected) {
      await connection.start();
      console.log(userId);
      console.log("connection started");
    }
  } catch (err) {
    console.error("eroare conexiune", err);
    setTimeout(startConnection, 5000);
  }
};
export default connection;
