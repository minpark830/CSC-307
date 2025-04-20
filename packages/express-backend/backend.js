// backend.js
import express from "express";
import cors from "cors";

const app = express();
const port = 8000;

const users = {
    users_list: [
      {
        id: "xyz789",
        name: "Charlie",
        job: "Janitor"
      },
      {
        id: "abc123",
        name: "Mac",
        job: "Bouncer"
      },
      {
        id: "ppp222",
        name: "Mac",
        job: "Professor"
      },
      {
        id: "yat999",
        name: "Dee",
        job: "Aspring actress"
      },
      {
        id: "zap555",
        name: "Dennis",
        job: "Bartender"
      }
    ]
};

const findUserById = (id) =>
    users["users_list"].find((user) => user["id"] === id);

const findUserByName = (name) => {
    return users["users_list"].filter(
      (user) => user["name"] === name
    );
};

const findUserByJob = (job) => {
    return users["users_list"].filter(
        (user) => user["job"] === job
      );
};

const findUserByNameAndJob = (name, job) => {
    return users["users_list"].filter(
        (user) => user["name"] === name && user["job"] === job
    );
};


const addUser = (user) => {
    if(!user.name || !user.job || user.name.trim() === "" || user.job.trim() === "") return false;
      
    users["users_list"].push(user);
    return true;
};

const deleteUserById = (id) => {
    const userIndex = users["users_list"].findIndex((user) => user["id"] === id);
    if(userIndex !== -1){
        users["users_list"].splice(userIndex, 1);
        return true;
    } 
    return false;
};

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
    if (name != undefined) {
        if(job != undefined){
            let result = findUserByNameAndJob(name, job);
            result = { users_list: result };
            res.send(result)
        } else {
            let result = findUserByName(name);
            result = { users_list: result };
            res.send(result);
        }
    } else if(job != undefined){
        let result = findUserByJob(job);
        result = { users_list: result };
        res.send(result);
    } else {
      res.send(users);
    }
});

app.get("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = findUserById(id);
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
});

app.post("/users", (req, res) => {
    const userToAdd = {
      id: generateUniqueId(),
      ...req.body       
    };
    const success = addUser(userToAdd);
    if(!success) res.status(400).send("Missing required fields: name and job must not be empty.");
    
    res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
    const id = req.params["id"]; //or req.params.id
    let result = deleteUserById(id);
    if (result){
        res.status(204).send();
    } else {
        res.status(404).send("Resource not found.");
    }
});

app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});