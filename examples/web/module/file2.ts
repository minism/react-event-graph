import { captureStackTrace, sleep } from "./shared";

export async function file2Func() {
  await sleep(1);
  await Promise.all([file2InnerFunc(), file2InnerFunc()]);
}

async function file2InnerFunc() {
  console.dir(captureStackTrace());
  await sleep(1);
}
