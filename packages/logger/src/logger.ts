import {
  EventGraph,
  EventGraphNode,
  ISubgraphChangedListener,
} from "@react-event-graph/shared";

export type EventGraphListener = (graph: EventGraph) => void;

export class EventGraphLogger implements ISubgraphChangedListener {
  private graph: EventGraph = new EventGraph(this);
  private destinations: EventGraphListener[] = [];

  constructor() {
    this.initialize();
  }

  /**
   * Convenience method for logging asynchronous functions to the event graph.
   *
   * Stores the promise state in the event node.
   */
  public async wrap<T>(name: string, promise: Promise<T>) {
    const node = this.root(name);
    node.attach("promise", "pending");
    try {
      const result = await promise;
      node.attach("promise", "fulfilled");
      return result;
    } catch (e: any) {
      node.attach("promise", "rejected");
      throw e;
    }
  }

  public root(name: string) {
    const root = new EventGraphNode(this, name);
    this.graph.rootNodes.push(root);
    this.notify();
    return root;
  }

  public clear() {
    this.initialize();
  }

  public addListener(destination: EventGraphListener) {
    this.destinations.push(destination);
  }

  public notify() {
    for (const destination of this.destinations) {
      destination(this.graph);
    }
  }

  private initialize() {
    this.graph = new EventGraph(this);
  }
}

export function logMethod(eventName?: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    eventName = eventName ?? propertyKey;
    if (target.__instrumentedMethodNames == null) {
      target.__instrumentedMethodNames = {};
    }
    target.__instrumentedMethodNames[propertyKey] = eventName;
  };
}

function instrumentMethod(
  eventName: string,
  func: Function,
  logger: EventGraphLogger
) {
  return function (this: any, ...args: any[]) {
    const ctx = args[args.length - 1];
    let child: EventGraphNode;
    if (typeof ctx == "object" && ctx instanceof EventGraphNode) {
      args.pop();
      child = ctx.child(eventName);
    } else {
      child = logger.root(eventName);
    }
    return func.call(this, ...args, child);
  };
}

export function instrumentClass<T extends { prototype: any }>(
  cls: T,
  logger: EventGraphLogger
): T {
  if (cls.prototype.__instrumentedMethodNames == null) {
    return cls;
  }
  for (const key of Object.getOwnPropertyNames(cls.prototype)) {
    if (key == "constructor") {
      continue;
    }
    const eventName = cls.prototype.__instrumentedMethodNames[key];
    if (eventName != null) {
      cls.prototype[key] = instrumentMethod(
        eventName,
        cls.prototype[key],
        logger
      );
    }
  }
  return cls;
}
