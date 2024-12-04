// Express app configuration
import express from "express";
import cors from "cors";
import routes from "./routes";
// import { errorHandler } from "./middlewares/errorHandler";
import * as swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "./swagger/swagger.json";
import { errorHandler } from "middlewares/errorHandler";



const app = express();

const corsOptions = {
    origin: '*', // allows all origins (will specify App url later)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'], // auth
    // credentials: true, // Allow cookies and credentials (auth)
}
app.use(cors(corsOptions));
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use("/api", routes);

// error handler has to go after routes
app.use(errorHandler);

export default app;


// Cors options for later, uses allowed origins to specify app url

// const corsOptions = {
//     origin: (origin, callback) => {
//       const allowedOrigins = ['https://yardhopper.com', 'https://yardhopperadmin.com'];
//       if (allowedOrigins.includes(origin) || !origin) {
//         callback(null, true); // Allow request
//       } else {
//         callback(new Error('Not allowed by CORS')); // Block request
//       }
//     },
//   };
