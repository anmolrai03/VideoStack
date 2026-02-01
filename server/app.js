// IMPORT MODULES STARTS HERE
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// IMPORT ROUTES STARTS HERE
import videoProcessingRoute from "./routes/videoProcessing.route.js"
import authRoute from "./routes/auth.route.js"
import errorHandler from './middlewares/errorhandler.middleware.js';
import allowedOrigins from './constants/appCORS.js';

// CONFIGURE DOTENV STARTS HERE
dotenv.config({
  path: './.env'
});

// CREATE APP
const app = express();

// CORS SETTING
app.use(
  cors(
    {
      origin: allowedOrigins,
      credentials: true
    }
  )
)

// SET JSON LIMIT
app.use(express.json({limit: '16kb'}));

// SET URL ENCODED LIMIT
app.use(express.urlencoded({extended: true , limit: '16kb'}));

// SET COOKIE PARSER
app.use(cookieParser());

// SET ROUTES
app.use("/api", videoProcessingRoute);
app.use("/api/auth", authRoute);


// HEALTH CHECK ROUTE FOR PRODUCTION
app.get('/health' , (req , res) => {
  res.status(200).send("server active.");
});

// ERROR MIDDLEWARE
app.use(errorHandler);

export default app;