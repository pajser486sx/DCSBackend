import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import dailyWordsRouter from "./routes/dailyWords.js";
import authRouter from "./routes/auth.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:5173"
  ],
  credentials: true
}));

app.get("/", (req, res) => {
  res.status(200).json({ message: "DCS backend running!" });
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend can read backend!" });
});

app.use("/api/auth", authRouter);
app.use("/api/daily-words", dailyWordsRouter);

await connectDB();

app.listen(PORT, error => {
  if (error) {
    console.error(`Error during DCS Backend startup: ${error.message}`);
  } else {
    console.log(`DCS App Server is running at http://localhost:${PORT} !`);
  }
});

/*import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db.js";
import dailyWordsRouter from "./routes/dailyWords.js";


// import još svih rutera

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;
// const corsOptions={
    //origin: [] //frontend koji je na renderu
//}


app.use(express.json());
app.use(cors())
//app.use (za sve rutere)


app.get("/", (req, res) => {
  res.status(200).json({ message: "DCS backend running!" });
});

app.use("/api/daily-words", dailyWordsRouter);

app.get("/api/test", (req, res) => {
  res.json({ message: "Frontend can read backend!" });
});


await connectDB();


app.listen(PORT, error => {
  if (error) {
    console.error(`Error during DCS Backend startup: ${error.message}`);
  } else {
    console.log(`DCS App Server is running at http://localhost:${PORT} !`);
  }
});
*/

// u mapu routes staviti sve stranice koje imam na frontendu (strana1.js, str2.js,...), importati ih tu
// i staviti u app.use("/str1", str1Router) i tako za sve ostale

