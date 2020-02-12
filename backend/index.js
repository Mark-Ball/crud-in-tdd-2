const app = require('./app');

const dbConnect = require('./database/connect');
dbConnect(process.env.DB_HOST);

app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}`));