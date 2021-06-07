import { FSharpEdge, toPayload } from "./edge";
import * as path from "path";

const rootDir = path.dirname(__dirname);

const main = async () => {
  const mainDllFullPath = path.join(
    rootDir,
    "fsharp",
    "bin",
    "Release",
    "netstandard2.0",
    "publish",
    "fsharp.dll"
  );
  const fsEdge = new FSharpEdge(mainDllFullPath);

  // 0: Hello World
  const payload0 = toPayload("hello-world");
  const res0 = await fsEdge.exec(payload0);
  console.log(`res0: ${JSON.stringify(res0)}`);

  const res0Sync = fsEdge.execSync(payload0);
  console.log(`res0Sync: ${JSON.stringify(res0Sync)}`);

  // 1: Echo
  const payload1 = toPayload("echo", Buffer.from("foobar", `utf-8`));
  const res1 = await fsEdge.exec(payload1);
  console.log(`res0: ${JSON.stringify(res1)}`);

  const res1Sync = fsEdge.execSync(payload1);
  console.log(`res0Sync: ${JSON.stringify(res1Sync)}`);

  // 2: Bogus command
  const payload2 = toPayload("reeeeeee");
  try {
    await fsEdge.exec(payload2);
  } catch (err) {
    console.log(`res2 caught error: ${err}`);
  }

  try {
    fsEdge.execSync(payload2);
  } catch (err) {
    console.log(`res2Sync caught error: ${err}`);
  }
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
