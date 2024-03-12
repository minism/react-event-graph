import { EventGraph, EventGraphNode } from "@react-event-graph/shared";
import { asyncBareFunction } from "./bareFunction";
import Controller from "./controller";
import logger from "./logger";

// Render the graph whenever it changes.
logger.addListener((graph) => {
  console.clear();
  process.stdout.write("Current graph\n");
  process.stdout.write(visualizeGraph(graph));
  process.stdout.write("\n");
});

function visualizeGraph(graph: EventGraph): string {
  function visualizeNode(node: EventGraphNode, indent: number): string {
    const prefix = " ".repeat(indent);
    const children = node.children
      .map((c) => visualizeNode(c, indent + 4))
      .join("\n");
    return `${prefix}- ${node.name} (${node.data.promise})\n${children}`;
  }
  return visualizeNode(graph.root, 0);
}

async function main() {
  // Show an example mixing automatic and manually wrapped methods.
  const controller = new Controller();
  const result = await Promise.all([
    controller.asyncMethod1(0.5, logger),
    controller.asyncMethod2AutomaticName(1, logger),
    asyncBareFunction(0.75, logger),
    logger.wrap("wrapped", (ctx) => asyncBareFunction(1.5, ctx)),
  ]);
}

main().catch(console.error);
