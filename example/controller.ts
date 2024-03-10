import { logMethod } from "@react-event-graph/logger";
import { instrumentClass } from "@react-event-graph/logger/src/logger";
import { sleep } from "./util";

class Controller {
  @logMethod("some event")
  async asyncMethod(seconds: number) {
    console.log(`Sleeping for ${seconds}`);
    await sleep(seconds);
    return "foo";
  }
}

export default instrumentClass(Controller);
