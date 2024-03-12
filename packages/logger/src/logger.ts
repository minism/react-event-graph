import {
  EventGraph,
  EventGraphNode,
  ISubgraphChangedListener,
} from "@react-event-graph/shared";

export type EventGraphListener = (graph: EventGraph) => void;

export interface IEventGraphContext {
  wrap<T>(
    name: string,
    cb: (ctx: IEventGraphContext) => Promise<T>
  ): Promise<T>;
}

export class EventGraphLogger
  implements ISubgraphChangedListener, IEventGraphContext
{
  private graph: EventGraph = new EventGraph(this);
  private rootContext: EventGraphNodeContext;
  private destinations: EventGraphListener[] = [];

  constructor() {
    this.rootContext = new EventGraphNodeContext(this.graph.root);
  }

  public async wrap<T>(
    eventName: string,
    cb: (ctx: IEventGraphContext) => Promise<T>
  ) {
    return this.rootContext.wrap(eventName, cb);
  }

  public clear() {
    // TODO: Implement
    // this.initialize();
  }

  public addListener(destination: EventGraphListener) {
    this.destinations.push(destination);
  }

  public notify() {
    for (const destination of this.destinations) {
      destination(this.graph);
    }
  }
}

class EventGraphNodeContext implements IEventGraphContext {
  constructor(public readonly node: EventGraphNode) {}

  async wrap<T>(
    eventName: string,
    cb: (ctx: IEventGraphContext) => Promise<T>
  ): Promise<T> {
    const child = this.node.child(eventName);
    child.attach("promise", "pending");
    try {
      const result = await cb(new EventGraphNodeContext(child));
      child.attach("promise", "fulfilled");
      return result;
    } catch (e: any) {
      child.attach("promise", "rejected");
      throw e;
    }
  }
}

export function logMethod(eventName?: string) {
  return function (target: any, propertyKey: string) {
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
    const lastArg = args[args.length - 1];
    let ctx: IEventGraphContext = logger;
    if (
      typeof lastArg == "object" &&
      (lastArg instanceof EventGraphNodeContext ||
        lastArg instanceof EventGraphLogger)
    ) {
      ctx = lastArg;
      args.pop();
    } else {
      ctx = logger;
    }
    return ctx.wrap(eventName, (c) => {
      return func.call(this, ...args, c);
    });
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
