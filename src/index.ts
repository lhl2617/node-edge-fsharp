import { FSharpEdge, SuccessResult, toPayload } from "./edge";
import * as path from "path";

const rootDir = path.dirname(__dirname);

const prettyPrintSuccessResult = (results: SuccessResult): string => {
  const stringifiedResult = {
    status: results.status,
    bufStr: results.res.toString(),
  };

  return JSON.stringify(stringifiedResult);
};

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
  console.log(`res0: ${prettyPrintSuccessResult(res0)}`);

  const res0Sync = fsEdge.execSync(payload0);
  console.log(`res0Sync: ${prettyPrintSuccessResult(res0Sync)}`);

  // 1: Echo
  const payload1 = toPayload("echo", Buffer.from("foobar", `utf-8`));
  const res1 = await fsEdge.exec(payload1);
  console.log(`res1: ${prettyPrintSuccessResult(res1)}`);

  const res1Sync = fsEdge.execSync(payload1);
  console.log(`res1Sync: ${prettyPrintSuccessResult(res1Sync)}`);

  // 2: Get version field
  const versionObject = { version: "69" };
  const payload2 = toPayload(
    "get-version-field-from-json",
    Buffer.from(JSON.stringify(versionObject))
  );
  const res2 = await fsEdge.exec(payload2);
  console.log(`res2: ${prettyPrintSuccessResult(res2)}`);

  const res2Sync = fsEdge.execSync(payload2);
  console.log(`res2Sync: ${prettyPrintSuccessResult(res2Sync)}`);

  // 3: Bogus command
  const payload3 = toPayload("reeeeeee");
  try {
    await fsEdge.exec(payload3);
  } catch (err) {
    console.log(`res3 caught error: ${err}`);
  }
  try {
    fsEdge.execSync(payload3);
  } catch (err) {
    console.log(`res3Sync caught error: ${err}`);
  }

  // Let's try calling echo synchronously 100 times
  console.log(`Launching 100000 calls to "echo"`);
  const startTime = Date.now();

  for (let i = 0; i < 100000; i++) {
    fsEdge.execSync(payload1);
  }

  const endTime = Date.now();
  console.log(`100000 calls to "echo" took ${endTime - startTime}ms`);
};

(async () => {
  try {
    await main();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
