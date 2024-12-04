const express = require("express");
const cors = require("cors");
const { getUsers, updateUserWinnerStatus } = require("./db");

const app = express();
const PORT = 3001;

app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Parse JSON bodies

// GET endpoint to fetch users
app.get("/api/users", async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// PUT endpoint to update user's isWinner status
app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const { isWinner } = req.body;

  // Validate input
  if (typeof isWinner !== "boolean") {
    return res.status(400).json({ error: "Invalid isWinner value. Must be true or false." });
  }

  try {
    await updateUserWinnerStatus(Number(id), isWinner);
    res.json({ message: `User ${id}'s isWinner status updated to ${isWinner}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
