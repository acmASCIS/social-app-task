import express from "express";
require("dotenv").config();
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app: express.Application = express();
const port = process.env.PORT;
var usersRouter = require('./routes/users');
// body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// test endpoints
app.get("/test", (req: express.Request, res: express.Response) => {
  res.json("test api endpoint");
});
app.post("/test", (req: express.Request, res: express.Response) => {
  const { name, age } = req.body;
  res.json({
    name,
    age,
  });
});

// to connect to mongodb url
mongoose.connect(
  process.env.MONGOURI||
    "your local database url like {'mongodb://localhost:27017/your database name'}",
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

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});

app.use('/users', usersRouter); 
