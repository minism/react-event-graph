"use client";

import { useEffect } from "react";
import { file1Func } from "../module/file1";
import { file2Func } from "../module/file2";

export default function Home() {
  useEffect(() => {
    (async function () {
      await file1Func();
      await file2Func();
    })();
  }, []);

  return <div>Hi</div>;
}
