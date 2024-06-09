/*app.ts*/
import express, { Express } from 'express';
import opentelemetry, { SpanStatusCode } from '@opentelemetry/api';
import { Metrics } from './metricsFunctions';
import { Person, PurchasedProduct } from './types';
import { SpanEnrichment } from './tracingFunctions';
import { ProductPriceCalculator } from './product_price_calculator';

const PORT: number = parseInt(process.env.PORT || '8080');
const app: Express = express();
app.use(express.json());

const defaultMeter = opentelemetry.metrics.getMeter(
  'defaultMeter'
);


const metrics = new Metrics(defaultMeter);

app.post('/pay', (req, res) => {
  const product: PurchasedProduct = req.body;
});


const tracer = opentelemetry.trace.getTracer('practical-opentelemetry-js');

app.get('/', (req, res) => {
  tracer.startActiveSpan('getHelloWorld', (span) => {

    res.status(200).send('Hello World');

    span.end();
  });
});

app.post('/person', (req, res) => {
  const person: Person = req.body;

  const span = opentelemetry.trace.getActiveSpan();

  if (!ValidatePerson(person)) {
    res.status(400).send('Invalid person');
    return;
  }

  SpanEnrichment.enrichWithPerson(span, person);



  res.status(200).send(person);
});

app.get('/price', (req, res) => {
  const categoryId: number = parseInt(req.query.categoryId as string);
  const productPrice: number = parseFloat(req.query.price as string);

  const span = opentelemetry.trace.getActiveSpan();
  span?.setAttribute('product.categoryId', categoryId);



  const newPrice = ProductPriceCalculator.calculatePrice(categoryId, productPrice);

  res.status(200).send({ newPrice });
});

app.listen(PORT, () => {
  console.log(`Listening for requests on http://localhost:${PORT}`);
});

function ValidatePerson(person: Person): boolean {

  const span = opentelemetry.trace.getActiveSpan();

  if (person.firstname == "") {
    span?.addEvent("ValidationFailed", {
      'model.failed_field': 'firstname',
      'model.failed_value': person.firstname
    });
    return false;
  }

  return true;

}
