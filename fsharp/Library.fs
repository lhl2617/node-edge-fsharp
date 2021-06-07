namespace global

open System.Threading.Tasks

type Startup() =
    let processRun (arg: string) (buf: byte []) =
        match arg with
        | "hello-world" -> Ok <| "Hello World"
        | "echo" -> Ok <| System.Text.Encoding.ASCII.GetString buf
        | _ -> Error <| sprintf "Unknown argument `%s`" arg

    let run (input: obj) =
        let inputDict =
            input :?> System.Collections.Generic.IDictionary<string, obj>

        let arg : string = inputDict.["arg"] |> string
        let buf : byte [] = inputDict.["buf"] :?> byte []

        match processRun arg buf with
        | Ok out -> {| res = out; status = "success" |} :> obj
        | Error err -> {| status = "error"; err = err |} :> obj

    member _.AsyncFunc(input: obj) =
        async.Return(run input) |> Async.StartAsTask

    member _.SyncFunc(input: obj) =
        let tsk = new Task<obj>(fun _ -> run input)
        tsk.RunSynchronously()
        tsk
