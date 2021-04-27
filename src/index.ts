import express, { json } from "express";
require("dotenv").config({ path: "../.env.example" });
import mongoose from "mongoose";
import bodyParser from "body-parser";
import grid from "gridfs-stream";
import methodOverride from "method-override";
import usersRouter from "./routers/users_router";
import postsRouter from "./routers/posts_router";
import PostsController from "./controllers/posts_controller";
import morgan from "morgan"

//initializations
const app: express.Application = express();
const port = process.env.PORT;
const mongoURI = process.env.MONGOURI
const conn = mongoose.connection;
let gfs;

// middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride("_method"));
app.use(morgan("dev"));

//connections
app.listen(port, () => console.log(`server is running on port ${port}`));
mongoose.connect(mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true },
  () => console.log("connected to database"));

conn.once('open', () => {
  gfs = grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

//endpoints
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.get('/image/:filename', PostsController.getPostImage);

//info endpoints
app.get("/", (req: express.Request, res: express.Response) => res.sendFile("./resources/welcome.json", { root: __dirname }));
app.use("/help", (req: express.Request, res: express.Response) => res.sendFile("./resources/docs.json", { root: __dirname }));

//error handlers
declare global {

  interface Error {
    status?: number

  }
}

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  const error = new Error("Endpoint not found.");
  error.status = 404;
  next(error);
});

app.use((error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
      status: error.status
    },
    hint: "Navigate to (/help) endpoint for documentation."
  })
});