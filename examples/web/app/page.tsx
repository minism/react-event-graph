import { useEffect } from "react";
import { rootContext } from "../module/context";
import { file1Func } from "../module/file1";
import { file2Func } from "../module/file2";

export default function Home() {
  useEffect(() => {
    (async function () {
      await rootContext.withSpan("file1Func", (ctx) => file1Func(ctx));
      await rootContext.withSpan("file2Func", (ctx) => file2Func(ctx));
    })();
  }, []);

  return <div>Hi</div>;
}
