export interface ISubgraphChangedListener {
  notify(): void;
}

export class EventGraph implements ISubgraphChangedListener {
  public root: EventGraphNode;

  public constructor(private readonly listener: ISubgraphChangedListener) {
    this.root = new EventGraphNode(this, "(root)");
  }

  public notify() {
    this.listener.notify();
  }

  public serialize(space?: string | number): string {
    return JSON.stringify(this.dehydrate(), null, space);
  }

  public static deserialize(
    rootListener: ISubgraphChangedListener,
    json: string
  ): EventGraph {
    return EventGraph.hydrate(rootListener, JSON.parse(json));
  }

  // TODO: Typing here.
  private dehydrate(): any {
    return {
      root: this.root.dehydrate(),
    };
  }

  private static hydrate(
    rootListener: ISubgraphChangedListener,
    data: any
  ): EventGraph {
    const graph = new EventGraph(rootListener);
    graph.root = EventGraphNode.hydrate(graph, data);
    return graph;
  }
}

export class EventGraphNode implements ISubgraphChangedListener {
  // TODO: Value should be json type.
  public data: Record<string, any> = {};

  public children: EventGraphNode[] = [];

  constructor(
    private readonly listener: ISubgraphChangedListener,
    public readonly name: string
  ) {}

  public child(name: string) {
    const node = new EventGraphNode(this, name);
    this.children.push(node);
    this.notify();
    return node;
  }

  public attach(key: string, value: any) {
    this.data[key] = value;
    this.notify();
  }

  public notify() {
    // We just bubble up to the top everything for now, but we could imagine
    // smarter subgraph re-rendering in the future similar to react VDOM.
    this.listener.notify();
  }

  // TODO: Typing here.
  public dehydrate(): any {
    return {
      name: this.name,
      data: this.data,
      children: this.children.map((n) => n.dehydrate()),
    };
  }

  public static hydrate(
    listener: ISubgraphChangedListener,
    data: any
  ): EventGraphNode {
    const node = new EventGraphNode(listener, data.name);
    node.data = data.data;
    node.children = data.children.map((child: any) =>
      EventGraphNode.hydrate(node, child)
    );
    return node;
  }
}
