import jsonServer from 'json-server';
import { loginController, registerController } from './controllers/authController.mjs';
import { readDb, writeDb } from './repositories/dataRepository.mjs';

const server = jsonServer.create();
const router = jsonServer.router('api/db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

server.get('/health', (_req, res) => {
  res.json({ ok: true, message: 'API Heladería activa' });
});

server.post('/login', loginController);
server.post('/register', registerController);

server.post('/orders', async (req, res) => {
  const db = await readDb();
  const payload = {
    id: Date.now(),
    ...req.body,
    createdAt: new Date().toISOString(),
  };

  db.orders.push(payload);
  await writeDb(db);
  res.status(201).json({ success: true, order: payload });
});

server.use(router);

const port = Number(process.env.PORT || 3001);
server.listen(port, () => {
  console.log(`JSON Server mock corriendo en http://localhost:${port}`);
});
