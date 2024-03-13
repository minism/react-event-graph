import api, { Context, ROOT_CONTEXT, Span } from "@opentelemetry/api";

// TODO: Ask on github why this is necessary.
export class MyContext {
  constructor(public readonly context: Context, public readonly span?: Span) {}

  public async withSpan<T>(name: string, cb: (ctx: MyContext) => Promise<T>) {
    const context =
      this.span != null
        ? api.trace.setSpan(this.context, this.span)
        : this.context;
    const span = tracer.startSpan(name, {}, context);

    // Set the active context in case it plays nice with other opentelemetry
    // behaviors, but we don't need this ourselves, since we
    return api.context.with(context, () => {
      try {
        return cb(new MyContext(context, span));
      } finally {
        span.end();
      }
    });
  }
}

export const rootContext = new MyContext(ROOT_CONTEXT, undefined);

export const tracer = api.trace.getTracer("my-tracer");
