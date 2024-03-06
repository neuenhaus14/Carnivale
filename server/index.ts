import server from './app';

// SERVER CONNECTION
const port = 4000;

server.listen(port, () => {
  console.log(`
  Listening here: http://127.0.0.1:${port}
  `);
});
