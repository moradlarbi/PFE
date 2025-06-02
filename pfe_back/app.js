import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
const app = express();
import cookieParser from "cookie-parser";
import routes from "./routes/index.js";

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});
// Middleware
app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());

const allowedOrigins = [
  'https://probable-chainsaw-5r6j9x5xx96cp6vj-3001.app.github.dev',
  'http://localhost:3000'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // autorise les requêtes avec origin connu ou sans origin
    } else {
      console.log('Blocked by CORS: ', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use('/api', routes);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
