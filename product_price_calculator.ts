import opentelemetry, { AttributeValue, SpanKind } from '@opentelemetry/api';
import { Span } from '@opentelemetry/api';
import * as DiagnosticNames from './telemetry_names';
const tracer = opentelemetry.trace.getTracer('practical-opentelemetry-js');

export abstract class ProductPriceCalculator {
  public static calculatePrice(categoryId: number, productPrice: number): number {

    let newPrice: number = productPrice;

    tracer.startActiveSpan(DiagnosticNames.CALCULATE_PRODUCT_MARKUP_SPAN, {
      kind: SpanKind.INTERNAL,
      attributes: {
        [DiagnosticNames.PRODUCT_PRICE_ORIGINAL]: productPrice,
        [DiagnosticNames.PRODUCT_CATEGORY_ID]: categoryId,
      },
    }, (span: Span) => {

      for (let i = 0; i < categoryId; i++) {
        let markup = Math.random() * (categoryId - 0) + 0;
        newPrice += markup;
      }
      span.setAttribute(DiagnosticNames.PRODUCT_PRICE_WITH_MARKUP, newPrice);
      span.end();
    });

    return newPrice;
  }
}
