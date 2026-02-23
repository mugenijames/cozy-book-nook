import app from "./app";

const PORT = process.env.PORT || 5000;
const booksRoute = require("./routes/books");
app.use("/api/books", booksRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
