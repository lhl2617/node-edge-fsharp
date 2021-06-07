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
> node-edge-fsharp@0.1.0 start C:\Users\lhlee\Documents\experiments\node-edge-fsharp
> ts-node src/index.ts

res0: {"res":"Hello World","status":"success"}
res0Sync: {"res":"Hello World","status":"success"}
res0: {"res":"foobar","status":"success"}
res0Sync: {"res":"foobar","status":"success"}
res2 caught error: Error: Unknown argument `reeeeeee`
res2Sync caught error: Error: Unknown argument `reeeeeee`
```