const express = require("express");
const app = express();
const port = 3030;
const fsp = require("fs").promises;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Content-Type", "application/json");

  next();
});

app.use(express.json());

const readTodo = async () => {
  return await fsp
    .readFile(__dirname + "/" + "todos.json", { encoding: "utf-8" })
    .then((data) => {
      return data;
    });
};

const writeTodo = async (newData) => {
  const dataStringified = JSON.stringify(newData);

  return await fsp
    .writeFile(__dirname + "/" + "todos.json", dataStringified, {
      encoding: "utf-8",
    })
    .then((data) => {
      return data;
    });
};

app.get("/", async (req, res) => {
  const data = await readTodo();

  res.send(data);
});

app.post("/", async (req, res) => {
  const data = await readTodo();

  const body = req.body;
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

  writeTodo(newData);
  res.send(body);
});

app.delete("/:id", async (req, res) => {
  const data = await readTodo();

  const dataParse = JSON.parse(data);
  const todoId = parseInt(req.params.id);
  const newData = dataParse.filter((todo) => {
    if (todo.id === todoId) {
      return false;
    }
    return true;
  });

  writeTodo(newData);
  res.send();
});

app.patch("/:id", async (req, res) => {
  const data = await readTodo();

  const dataParse = JSON.parse(data);
  const todoId = parseInt(req.params.id);
  const newData = dataParse.map((todo) => {
    if (todo.id === todoId) {
      todo.isChecked = !todo.isChecked;
      return todo;
    }
    return todo;
  });

  writeTodo(newData);
  res.send();
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
