const express = require("express");
const app = express();
const port = 3000;
const users = require("./MOCK_DATA.json");

app.get("/users", (req, res) => {
  return res.json(users);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
