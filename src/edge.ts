import * as edge from "edge-js";
import * as path from "path";
import * as fs from "fs";

export type PayloadType = {
  arg: string;
  buf: Buffer;
};

type ResultStatus = {
  status: "success" | "error";
};

export type SuccessResult = ResultStatus & {
  res: string;
};

export type ErrorResult = ResultStatus & {
  err: string;
};

export type Result = SuccessResult | ErrorResult;

export const isErrorResult = (result: Result): result is ErrorResult => {
  return result.status === "error";
};

export const isSuccessResult = (result: Result): result is SuccessResult => {
  return result.status === "success";
};

export const toPayload = (
  arg: string,
  buf: Buffer = Buffer.alloc(0)
): PayloadType => {
  return {
    arg: arg,
    buf: buf,
  };
};

export class FSharpEdge {
  private edgeFuncAsyncWrapper: edge.Func<PayloadType, Result>;
  private edgeFuncSyncWrapper: edge.Func<PayloadType, Result>;
  constructor(mainDllFullPath: string) {
    const mainDllBaseName = path.basename(mainDllFullPath);
    const dllPath = path.join(path.dirname(mainDllFullPath));
    // we need to load all reference dlls.
    // This is a HACK. We should actually read the *.deps.json file.
    // But it works!
    const refDlls = fs
      .readdirSync(dllPath)
      .filter((f) => path.extname(f) === `.dll`)
      .filter((f) => f !== mainDllBaseName)
      .map((f) => path.join(dllPath, f));
    this.edgeFuncAsyncWrapper = edge.func({
      assemblyFile: mainDllFullPath,
      typeName: `Startup`,
      methodName: `AsyncFunc`,
      references: refDlls,
    });

    this.edgeFuncSyncWrapper = edge.func({
      assemblyFile: mainDllFullPath,
      typeName: `Startup`,
      methodName: `SyncFunc`,
      references: refDlls,
    });
  }

  public execSync = (payload: PayloadType): SuccessResult => {
    const res = this.edgeFuncSyncWrapper(payload, true);
    if (isSuccessResult(res)) {
      return res;
    } else if (isErrorResult(res)) {
      throw new Error(res.err);
    }
    throw new Error(`Unknown result: ${res}`);
  };

  public exec = (payload: PayloadType): Promise<SuccessResult> => {
    return new Promise((resolve, reject) => {
      this.edgeFuncAsyncWrapper(payload, (err: Error, res: Result) => {
        if (!err && isErrorResult(res)) {
          err = new Error(res.err);
        }
        if (err) {
          reject(err);
        } else {
          resolve(res as SuccessResult);
        }
      });
    });
  };
}
