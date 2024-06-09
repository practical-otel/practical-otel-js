import { Person } from "./types";
import { Span } from "@opentelemetry/api";

export abstract class SpanEnrichment {
  public static enrichWithPerson(span: Span|undefined, person: Person): Span|undefined {
    span!.setAttribute('person.firstname', person.firstname);
    span!.setAttribute('person.surname', person.surname);
    return span;
  }
}
