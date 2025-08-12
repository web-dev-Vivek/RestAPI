const express = require("express");
const app = express();
const port = 3000;
const users = require("./MOCK_DATA.json");
const fs = require("fs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json()); // to handle JSON requests

// Logging middleware
app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}:${req.ip}: ${req.method}: ${req.path}`,
    (err) => {
      if (err) {
        console.error("Error writing to log file", err);
      }
      next();
    }
  );
});

// Example second middleware
app.use((req, res, next) => {
  console.log("hello from middleware2");
  next();
});

// API routes
app.get("/api/users", (req, res) => {
  return res.json(users);
});

app.get("/users", (req, res) => {
  const html = `
    <ul>
      ${users
        .map((user) => `<li>${user.first_name} ${user.last_name}</li>`)
        .join("")}
    </ul>
  `;
  res.send(html);
});

app.get("/users/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = users.find((user) => user.id === id);
  return res.json(user || { error: "User not found" });
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user || { error: "User not found" });
  })
  .patch((req, res) => {
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {
    return res.json({ status: "pending delete" });
  });

app.post("/api/users", (req, res) => {
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.job_title
  ) {
    return res.status(400).json({ error: "Invalid user data" });
  }
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err) => {
    if (err) {
      console.error("Error saving data", err);
      return res.status(500).json({ status: "error" });
    }
    resstatus(201).json({ status: "success", id: users.length });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
