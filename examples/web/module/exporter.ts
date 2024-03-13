import { ReadableSpan, SpanExporter } from "@opentelemetry/sdk-trace-web";
import { ExportResult, ExportResultCode } from "@opentelemetry/core";

export type SpanUpdateListener = (tree: SpanTreeNode) => void;

export type SpanTreeNode = {
  // Root is null
  span: ReadableSpan | null;
  children: SpanTreeNode[];
};

export class ReactViewSpanExporter implements SpanExporter {
  public root: SpanTreeNode = { span: null, children: [] };
  private nodesBySpanId: Record<string, SpanTreeNode> = {};
  private listeners: SpanUpdateListener[] = [];

  public addListener(listener: SpanUpdateListener) {
    this.listeners.push(listener);
  }

  public removeListener(listener: SpanUpdateListener) {
    this.listeners.splice(this.listeners.indexOf(listener), 1);
  }

  export(
    spans: ReadableSpan[],
    resultCallback: (result: ExportResult) => void
  ) {
    this.updateTree(spans);
    for (const listener of this.listeners) {
      listener(this.root);
    }
    resultCallback({
      code: ExportResultCode.SUCCESS,
    });
  }

  shutdown(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  forceFlush?(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private updateTree(spans: ReadableSpan[]) {
    for (const span of spans) {
      const node: SpanTreeNode = {
        span,
        children: [],
      };
      const parent = this.nodesBySpanId[span.parentSpanId ?? ""] ?? this.root;
      parent.children.push(node);
      this.nodesBySpanId[span.spanContext().spanId] = node;
    }
  }
}
