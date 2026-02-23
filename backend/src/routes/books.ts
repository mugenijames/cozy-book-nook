const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET all books
router.get("/", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM books");
  res.json(rows);
});

// GET single book
router.get("/:slug", async (req, res) => {
  const [rows] = await db.query(
    "SELECT * FROM books WHERE slug = ?",
    [req.params.slug]
  );
  res.json(rows[0]);
});

// CREATE book (admin)
router.post("/", async (req, res) => {
  const { title, slug, description, cover } = req.body;

  await db.query(
    "INSERT INTO books (title, slug, description, cover) VALUES (?, ?, ?, ?)",
    [title, slug, description, cover]
  );

  res.json({ message: "Book created" });
});

module.exports = router;