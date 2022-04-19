import express from 'express';
import path from 'path';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));
app.use(express.static('public'));
const __dirname = path.resolve();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/shopCart', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/shopCart.html'));
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
