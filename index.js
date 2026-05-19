import express from "express";
const app = express();
app.use(express.json());
const PORT = 3000;


app.get("/", (req, res) => {
  res.status(200).json({ message: "DCS backend running!" });
});

app.listen(PORT, error => {
  if (error) {
    console.error(`Error during DCS Backend startup: ${error.message}`);
  } else {
    console.log(`DCS App Server is running at http://localhost:${PORT} !`);
  }
});