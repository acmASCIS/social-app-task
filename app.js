const express=require("express");
const router=express.Router();
const users = require("./users");

const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
//const user=require("./users");
const multer  = require('multer');
const { Console } = require("console");
const { Mongoose } = require("mongoose");
const upload=multer({dest:'upload/'})
 
router.get("/", async (req, res) => {
    try {
      const users = await users.find();
      res.status(200).json(courses);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  router.get("/:userId", async (req, res) => {
    try {
      const id = req.params.userId;
      const user = await users.findById(id);
      if (user) {
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: "No valid entry found" });
      }
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });


  
router.post("/",upload.single('userImage'), async (req, res) => {
    Console.log(req.file);
    const user = new users({
      name: req.body.name,
      email: req.body.email,
      created_at:req.body.created_at
    });
  users
  .save()
    try {
      const olduser= await user.save();
      res.status(201).json({
        message: "Success!",

      });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });
  
/*app.use(bodyParser.json());

app.post('/fileUpload' , multer.single('fileFieldName'), (req , res) => {
    const fileRecievedFromClient = req.file; //File Object sent in 'fileFieldName' field in multipart/form-data
    console.log(req.file)

    let form = new FormData();
    form.append('fileFieldName', fileRecievedFromClient.buffer, fileRecievedFromClient.originalname);

    axios.post('http://server2url/fileUploadToServer2', form, {
            headers: {
                'Content-Type': `multipart/form-data; boundary=${form._boundary}`
            }
        }).then((responseFromServer2) => {
            res.send("SUCCESS")
        }).catch((err) => {
            res.send("ERROR")
        })
})*/

  router.patch("/:userId", async (req, res) => {
    try {
      const id = req.params.userId;
      const newuser = await users.updateOne(
        { _id: id },
        {
          $set: { name: req.body.name }
        }
      );
      res.status(200).json(newuser);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

  
router.delete("/:userId", async (req, res) => {
    try {
      const id = req.params.userId;
      const removeUser = await Course.remove({ _id: id });
      res.status(200).json(removeUser);
    } catch (err) {
      res.status(500).json({ message: err });
    }
  });

module.exports=router; 