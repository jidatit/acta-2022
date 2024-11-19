import express from "express";
import { createServer } from "http";
import bodyParser from "body-parser";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import AdminRoutes from "./Routes/AdminRoutes.js";

const app = express();
const server = createServer(app);
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:5173", // Add your new frontend URL here
    ],
    credentials: true,
  })
);

const port = process.env.PORT || 5000;

app.use("/Admin", AdminRoutes);

app.get("/", (req, res) => {
  res.json({ message: "hey brother" });
});

server.listen(port, () => {
  console.log(`Server is Listening at Port ${port}`);
});

export default app;
