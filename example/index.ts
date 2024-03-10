import { EventGraphLogger, logMethod } from "@react-event-graph/logger";
import Controller from "./controller";
import { sleep } from "./util";
import logger from "./logger";

async function asyncBareFunction(seconds: number) {
  await sleep(seconds);
}

// Render the graph whenever it changes.
logger.addListener((graph) => {
  console.clear();
  process.stdout.write("Current graph\n");
  process.stdout.write(graph.serialize(2));
  process.stdout.write("\n");
});

async function main() {
  // Wrapping example.
  // const call1 = logger.wrap("Call 1", asyncCall(0.5));
  // const call2 = logger.wrap("Call 2", asyncCall(2));
  // await call2;

  const controller = new Controller();
  const result = await Promise.all([
    controller.asyncMethod1(0.5),
    controller.asyncMethod2AutomaticName(1),
  ]);
}

main().catch(console.error);
