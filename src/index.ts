require("dotenv").config();
import express from "express";
import './DB/dbConnection';
import bodyParser from "body-parser";
import userRouter from './routers/user';
import postRouter from './routers/post';

const app: express.Application = express();
const port = process.env.PORT;

// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(userRouter);
app.use(postRouter);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
