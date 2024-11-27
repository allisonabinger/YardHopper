// Express app configuration
import express from "express";
import cors from "cors";
import routes from "./routes";
// import { errorHandler } from "./middlewares/errorHandler";
import * as swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "./swagger/swagger.json";




const app = express();
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use("/api", routes);
// app.use(errorHandler);

export default app;
