// backend.js
import express from "express";
import cors from "cors";
import userService from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose
  .connect(MONGO_CONNECTION_STRING + "users") // connect to Db "users"
  .catch((error) => console.log(error));

const app = express();
const port = 8000;

const generateUniqueId = () => {
    let newId;
    let idExist = true;
    let maxIdNumber = 1000000;

    while(idExist){
      newId = Math.floor(Math.random() * maxIdNumber).toString();

      idExist = users["users_list"].some(user => user.id === newId);
    }

    return newId;
};

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
  
app.get("/users", (req, res) => {
    const name = req.query.name;
    const job = req.query.job;

    userService.getUsers(name, job)
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });

});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id

    userService.findUserById(id)
    .then((user) => {
      if(!user) res.status(404).send("Resource not found.");
      res.send(user);
    })
    .catch((error) => {
      res.status(500).send(error.name);
    });

});

app.post("/users", (req, res) => {
    const userToAdd = req.body;       

    userService.addUser(userToAdd)
    .then((result) => {
      res.status(201).send(result);
    })
    .catch((error) => {
      res.status(400).send("Missing required fields: name and job must not be empty.");
    });

});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id

    userService.deleteUserById(id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(404).send(error.name);
    });

});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});