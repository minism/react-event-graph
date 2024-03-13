import { MyContext } from "./context";
import { sleep } from "./shared";

export async function file2Func(ctx: MyContext) {
  await sleep(1);
  ctx.span!.setAttribute("asdofijdsoaif", 12);
  await Promise.all([
    ctx.withSpan("foo", () => file2InnerFunc()),
    ctx.withSpan("bar", () => file2InnerFunc()),
  ]);
}

async function file2InnerFunc() {
  // console.dir(captureStackTrace());
  await sleep(1);
}
