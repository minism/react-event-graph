import { sleep } from "./util";
import Controller from "./controller";
import { EventGraphNode } from "@react-event-graph/shared";

export async function asyncBareFunction(seconds: number, ctx?: EventGraphNode) {
  await sleep(seconds);
  const controller = new Controller();
  await controller.asyncMethod1(seconds, ctx);
  await anotherBareFunction(0.25, ctx);
}

async function anotherBareFunction(seconds: number, ctx?: EventGraphNode) {
  await sleep(seconds);
}
