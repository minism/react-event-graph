import { MyContext } from "./context";
import { sleep } from "./shared";

export async function file1Func(ctx: MyContext) {
  ctx.span!.setAttribute("foo", "bar");
  await sleep(1);
  await ctx.withSpan("inner", () => sleep(1));
}
