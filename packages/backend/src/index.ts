import server from './bootstrap';

const port = Number(process.env.PORT || 3000);

if (process.env.NODE_ENV !== 'test') {
  server.start(port);
}
