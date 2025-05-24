import app from "./src/ticketApp.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
