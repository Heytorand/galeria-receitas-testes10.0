import express from "express";
import { pageRoutes } from "./routes/pageRoutes";
import { apiRoutes } from "./routes/apiRoutes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
app.set("view engine", "ejs");
app.set("views", "./src/views");
app.use(pageRoutes);
app.use(apiRoutes);

export default app;
