/*app.ts*/
import express, { Express } from 'express';
import opentelemetry from '@opentelemetry/api';
import { Metrics } from './metricsFunctions';
import { Person, PurchasedProduct } from './types';

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Express = express();
app.use(express.json());

const defaultMeter = opentelemetry.metrics.getMeter(
  'defaultMeter'
);

const metrics = new Metrics(defaultMeter);

app.get('/', (req, res) => {
  res.status(200).send('Hello World');
});

app.post('/person', (req, res) => {
  console.log(req.url);
  const person: Person = req.body;
  res.status(200).send(person);
});

app.post('/pay', (req, res) => {
  const product: PurchasedProduct = req.body;
  metrics.AddSalesMetrics(product);
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

