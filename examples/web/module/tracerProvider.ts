import { ZoneContextManager } from "@opentelemetry/context-zone";
import {
  SimpleSpanProcessor,
  WebTracerProvider,
} from "@opentelemetry/sdk-trace-web";
import { ReactViewSpanExporter } from "./exporter";

export const exporter = new ReactViewSpanExporter();
const provider = new WebTracerProvider();
provider.addSpanProcessor(new SimpleSpanProcessor(exporter));
provider.register({
  // Changing default contextManager to use ZoneContextManager - supports asynchronous operations - optional
  contextManager: new ZoneContextManager(),
});
// Registering instrumentations
// registerInstrumentations({
//   instrumentations: [new DocumentLoadInstrumentation()],
// });
