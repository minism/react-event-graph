import { IEventGraphContext } from "@react-event-graph/logger";
import Controller from "./controller";
import { sleep } from "./util";

export async function asyncBareFunction(
  seconds: number,
  ctx: IEventGraphContext
) {
  await sleep(seconds);
  const controller = new Controller();
  await controller.asyncMethod1(seconds, ctx);
  await anotherBareFunction(0.25, ctx);
}

async function anotherBareFunction(seconds: number, ctx: IEventGraphContext) {
  await sleep(seconds);
}
