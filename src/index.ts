import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import './config.js';
import api from './routes/index.js';
import { checkConnections } from './utils/index.js';
import { serve } from '@hono/node-server';

const PORT = parseInt(process.env.PORT) || 3000;

const app = new Hono();
app.use(cors({ origin: '*' }));
app.use(logger());
app.route('/', api);

app.get('/health', checkConnections);
app.get('/startup', checkConnections);

serve({ fetch: app.fetch, port: PORT });
