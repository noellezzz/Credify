import app from "./app.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Running at http://localhost:${PORT}/`);
});
