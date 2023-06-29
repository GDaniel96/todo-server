const express = require("express");
const app = express();
const port = 3030;
// const fs = require("fs").promises;
const fs = require("fs");

//EXTRACT DUPLICATED CODE IN A METHOD
// REFACTOR CODE WITH FS PROMISES

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");

  next();
});

app.use(express.json());

const readTodo = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/" + "todos.json", "utf-8", (err, data) => {
      resolve(data);
    });
  });
};

app.get("/", async (req, res) => {
  const data = await readTodo();
  res.send(data);
});

app.post("/", (req, res) => {
  const body = req.body;

  fs.readFile(__dirname + "/" + "todos.json", "utf-8", (err, data) => {
    const dataParse = JSON.parse(data);
    const lastTodoIndex = dataParse.length - 1;
    const lastTodo = dataParse[lastTodoIndex];

    const lastTodoId = lastTodoIndex < 0 ? 1 : lastTodo.id;

    const newData = [
      ...dataParse,
      {
        ...body,
        id: lastTodoId + 1,
      },
    ];
    fs.writeFile(
      __dirname + "/" + "todos.json",
      JSON.stringify(newData),
      (err) => {
        console.log(err);
      }
    );
    res.send(body);
  });
});

app.delete("/:id", (req, res) => {
  fs.readFile(__dirname + "/" + "todos.json", "utf-8", (err, data) => {
    const dataParse = JSON.parse(data);
    const todoId = parseInt(req.params.id);
    const newData = dataParse.filter((todo) => {
      if (todo.id === todoId) {
        return false;
      }
      return true;
    });

    fs.writeFile(
      __dirname + "/" + "todos.json",
      JSON.stringify(newData),
      (err) => {
        console.log(err);
      }
    );
    res.send();
  });
});

app.patch("/:id", (req, res) => {
  fs.readFile(__dirname + "/" + "todos.json", "utf-8", (err, data) => {
    const dataParse = JSON.parse(data);
    const todoId = parseInt(req.params.id);
    const newData = dataParse.map((todo) => {
      if (todo.id === todoId) {
        todo.isChecked = !todo.isChecked;
        return todo;
      }
      return todo;
    });

    fs.writeFile(
      __dirname + "/" + "todos.json",
      JSON.stringify(newData),
      (err) => {
        console.log(err);
      }
    );
    res.send();
  });
});

app.listen(port, () => {
  console.log(`Mizeria asta cica asculta la portu' ${port}`);
});
