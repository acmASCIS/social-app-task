import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import userRouter from "./controllers/userController";
import postRouter from "./controllers/postController";

require("dotenv").config();

const app: express.Application = express();
const port = process.env.PORT || 3000;
const mongoURI = process.env.MONGOURI || 'mongodb://localhost:27017/socialapp';

// body parser
app.use(bodyParser.json());

app.use(userRouter);
app.use(postRouter);

async function main() {

  try {

    // connect to mongodb
    await mongoose.connect(
      mongoURI,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      },
      () => {
        console.log("connected to database");
      }
    );

    // 404 handler
    app.use((req, res, next) => {
      res.status(404).json({
        status: 404,
        message: "Page not found!"
      });
    });

    // error handler
    app.use(((err, req, res, next) => {
      res.status(err.status).json({
        status: err.status,
        message: err.message
      });

    }) as express.ErrorRequestHandler);


    app.listen(port, () => {
      console.log(`server is running on port ${port}`);
    });

  } catch (error) {
    console.log(`Error! ${error}`);
  }
}

main();
