import { EventGraphLogger } from "@react-event-graph/logger";

function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

const logger = new EventGraphLogger();

async function main() {
  console.log("ok");
  await sleep(0.5);
  await sleep(1);
}

main().catch(console.error);
