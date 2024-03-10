import {
  EventGraph,
  EventGraphNode,
  ISubgraphChangedListener,
} from "@react-event-graph/shared";

export type EventGraphLoggerDestination = (graph: EventGraph) => void;

export class EventGraphLogger implements ISubgraphChangedListener {
  private graph: EventGraph = new EventGraph(this);
  private destinations: EventGraphLoggerDestination[] = [];

  constructor() {
    this.initialize();
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

  public addDestination(destination: EventGraphLoggerDestination) {
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
