const express = require('express');

const app = express();
const port = 5000;

app.use(express.json());

app.use('/files', express.static('files'));
app.use('/api/model', require('./api/routes/model'));

app.listen(port, () => console.log(`App started on port ${port}...`));
