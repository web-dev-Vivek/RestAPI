const express = require("express");
const app = express();
const port = 3000;
const users = require("./MOCK_DATA.json");
const fs = require("fs");

app.use(express.urlencoded({ extended: false }));

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
  return res.json(user);
});

app
  .route("/api/users/:id")
  .get((req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => user.id === id);
    return res.json(user);
  })
  .patch((req, res) => {
    return res.json({ status: "pending" });
  })
  .delete((req, res) => {});

app.post("/api/users", (req, res) => {
  const body = req.body;
  users.push({ ...body, id: users.length + 1 });
  fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), (err, data) => {
    res.json({ status: "success", id: users.length });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
