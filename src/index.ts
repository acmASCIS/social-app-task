import express from "express";
require("dotenv").config();
import mongoose from "mongoose";
import bodyParser from "body-parser";

const app: express.Application = express();
const port = process.env.PORT;

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
  process.env.MONGOURI ||
    'mongo "mongodb+srv://socialmediacluster.8tztr.mongodb.net/<Social Media Backend>" --username SocialMediaApp',
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
