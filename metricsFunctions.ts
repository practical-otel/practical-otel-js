import { Attributes, Counter, Histogram, Meter, UpDownCounter } from "@opentelemetry/api";
import { PurchasedProduct } from "./types";

export class Metrics {
  constructor(meter: Meter) {
    this.salesValue = meter.createCounter('sales.value');
    this.salesCounter = meter.createCounter('sales.counter');
    this.salesMarkupValue = meter.createHistogram('sales.markup');
    this.salesUnprocessed = meter.createUpDownCounter('sales.unprocessed');
  }
  salesValue: Counter<Attributes>;
  salesCounter: Counter<Attributes>;
  salesMarkupValue: Histogram<Attributes>;
  salesUnprocessed: UpDownCounter<Attributes>;

  AddSalesMetrics(purchasedProduct: PurchasedProduct) {
    const attributes = {
      "product.id": purchasedProduct.productId
    };

    this.salesValue.add(purchasedProduct.price, attributes);
    this.salesCounter.add(1, attributes);
    this.salesMarkupValue.record(purchasedProduct.priceWithMarkup, attributes);
    this.salesUnprocessed.add(1, attributes);
  }

  SaleProcessed(purchasedProduct: PurchasedProduct) {
    const attributes = {
      "product.id": purchasedProduct.productId
    };

    this.salesUnprocessed.add(-1, attributes);
  }
}