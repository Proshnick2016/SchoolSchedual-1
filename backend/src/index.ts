import dotenv from 'dotenv';
import log4js from 'log4js';
import { useExpressServer } from 'routing-controllers';
import { UserController } from './controller/user-controller';
import express, { Express, RequestHandler } from 'express';
import bodyParser from 'body-parser';
import httpContext from 'express-http-context';
import { GlobalErrorHandler } from './middleware/global-error-handler';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from '../src/swagger/openapi.json';
import cors from 'cors';

dotenv.config();
const logger = log4js.getLogger();
logger.level = process.env.LOG_LEVEL;

const port = process.env.PORT;
const app: Express = express();

app.use(bodyParser.json());
app.use(httpContext.middleware);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors() as RequestHandler);

useExpressServer(app, {
  controllers: [UserController],
  middlewares: [GlobalErrorHandler],
  defaultErrorHandler: false
});

app.listen(port, () => console.log(`Running on port ${port}`));
