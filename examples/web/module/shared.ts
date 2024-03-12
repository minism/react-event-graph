export function sleep(seconds: number) {
  return new Promise((resolve) => setTimeout(resolve, seconds * 1000));
}

export function captureStackTrace() {
  const obj = { stack: "" };
  Error.captureStackTrace(obj, captureStackTrace);
  return obj.stack.split("\n");
}
