import { EventGraphLogger } from "@react-event-graph/logger";

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const logger = new EventGraphLogger();

// Print the graph whenever it changes.
logger.addDestination((graph) => {
  console.log("Current graph:");
  console.log(graph.serialize(2));
});

async function main() {
  const root = logger.root("Root");
  root.attach("data", 5);
  const child = root.child("Child 1");
  child.attach("state", "pending");
  await sleep(1);
  child.attach("state", "done");
  child.attach("data", 10);
}

main().catch(console.error);
