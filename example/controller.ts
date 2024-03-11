import { logMethod } from "@react-event-graph/logger";
import logger from "./logger";
import { instrumentClass } from "@react-event-graph/logger/src/logger";
import { sleep } from "./util";
import { EventGraphNode } from "@react-event-graph/shared";

class Controller {
  @logMethod("publicMethod")
  async asyncMethod1(seconds: number, ctx?: EventGraphNode) {
    await sleep(seconds);
    await Promise.all([
      this.asyncMethod2AutomaticName(1, ctx),
      this.asyncMethod2AutomaticName(2, ctx),
    ]);
    return "foo";
  }

  @logMethod()
  async asyncMethod2AutomaticName(seconds: number, ctx?: EventGraphNode) {
    await sleep(seconds);
    this.method3(ctx);
    return "bar";
  }

  @logMethod()
  async method3(ctx?: EventGraphNode) {
    return "baz";
  }
}

export default instrumentClass(Controller, logger);
