import './config.js';

import express, { Request, Response, Express, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import api from './routes/index.js';

const PORT = process.env.PORT || 3000;

const app: Express = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(
	morgan(
		':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms ":referrer" ":user-agent"'
	)
);
app.use('/', api);

const checkConnections = async (
	_req: Request,
	res: Response,
	_next: NextFunction
) => {
	res.writeHead(200);
	res.end('OK');
};

app.get('/health', checkConnections);
app.get('/startup', checkConnections);

app.listen(PORT, () => {
	console.log(`[server]: Server is running at http://localhost:${PORT}`);
});

[
	'SIGINT',
	'SIGTERM',
	'SIGQUIT',
	'uncaughtException',
	'unhandledRejection',
].forEach((signal) => {
	process.on(signal, (e) => {
		console.log('Process forced shutdown:', signal, e);
		process.exit(0);
	});
});
