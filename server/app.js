// IMPORT MODULES
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// IMPORT ROUTES
import videoProcessingRoute from "./routes/videoProcessing.route.js"

// CONFIGURE DOTENV
dotenv.config({
  path: './.env'
});

// CREATE APP
const app = express();

// CORS SETTING
app.use(
  cors(
    {
      origin: process.env.CORS_ORIGIN,
      credentials: true
    }
  )
)

// SET JSON LIMIT
app.use(express.json({limit: '16kb'}));

// SET URL ENCODED LIMIT
app.use(express.urlencoded({extended: true , limit: '16kb'}));

// SET ROUTES
app.use("/api", videoProcessingRoute);

// HEALTH CHECK ROUTE FOR PRODUCTION
app.get('/health' , (req , res) => {
  res.status(200).send("server active.")
});

export default app;