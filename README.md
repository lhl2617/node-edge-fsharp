# Node-Edge-FSharp

Node process calling FSharp via [edge.js](https://github.com/tjanczuk/edge)

## Getting Started

### Requirements
- `node`
- `npm`
- [.NET Core 3.x](https://dotnet.microsoft.com/download)

### Running
1. Clone the repo (duh)
2. Install dependencies: `npm i`
3. Run: `npm start`
    
If everything succeeded, you should get the following output:
```
res0: {"status":"success","bufStr":"Hello World"}
res0Sync: {"status":"success","bufStr":"Hello World"}
res1: {"status":"success","bufStr":"foobar"}
res1Sync: {"status":"success","bufStr":"foobar"}
res2: {"status":"success","bufStr":"69"}
res2Sync: {"status":"success","bufStr":"69"}
res3 caught error: Error: Unknown argument `reeeeeee`
res3Sync caught error: Error: Unknown argument `reeeeeee`
Launching 100000 calls to "echo"
100000 calls to "echo" took 2040ms
```

Obviously, the last line differs based on your system.

### Developing

If you make any changes to the FSharp code in [`./fsharp`](./fsharp), run `npm run build` to rebuild the FSharp library before running `npm start`.