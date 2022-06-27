import { Node, NodeEdge, TriggerNodeEdge } from "../decoders/nodes";
import Engine from "./engine";

type Status = { tag: "reachable" | "processing" | "unreachable" } | {
    tag: "success",
    result: any
} | {
    tag: "failure",
    error: Error
}

type EngineNodeEdge<N extends Node = Node> = {
    node: EngineNode<N>,
} & TriggerNodeEdge

type EngineNode<N extends Node = Node> = {
    downstream: EngineNodeEdge[],
    upstream: EngineNode[],
    // status: Status
} & N



export { EngineNode, EngineNodeEdge, Status };