import { fromPairs, flow, map, get, isString } from "lodash/fp";
import { Express, Request, Response } from "express";
import { values } from "lodash";
import { Source } from "../decoders/sources";
import { Node, SourceNode, NodeEdge, RestEndpointPathSegment, RestEndpointNode, RestEndpointPathParameterSegment } from "../decoders/nodes";
import { Condition, getComparisonFunction } from "../decoders/conditions";
import { endpointPathSegmentToString, isSource } from "./utils";
import { ExecutionQueueRuntime } from "./runtime";
import { RestEndpointRuntimeEnvironment } from "./runtime-env";
import { EngineNode } from "./engine-node";

const initEngineNodes = (nodes: Array<Node>): Array<EngineNode> => {
    // TODO:
    return [];
//     nodes.map((node) => ({
//     ...node,
//     status: { tag: "reachable" },
//     downstream: node.downstream || [],
//     upstream: nodes
//         .filter(
//             (other: Node) => other.downstream?.includes(node.id)
//         ).map(
//             (node: Node) => node.id
//         )
// }));
};

class Engine {
    private sources: EngineNode<SourceNode>[];

    private nodes: Record<string, EngineNode>;

    constructor(nodes: Node[]) {
        const engineNodes: Array<EngineNode> = initEngineNodes(nodes);
        this.nodes = fromPairs(engineNodes.map((node: EngineNode) => [node.id, node]));
        this.sources = engineNodes.filter(isSource);
    }

    private createRestEndpoint = (app: Express, endpoint: EngineNode<RestEndpointNode>) => {
        const path = "/" + endpoint.pathSegments.map(
            // TODO: optional segments
            endpointPathSegmentToString
        ).join("/");

        const pathParams: string[] = endpoint.pathSegments
            .filter(
                (param): param is RestEndpointPathParameterSegment => param.source === "path-parameter")
            .map(
                param => param.name
            );


        const handler = async (req: Request, res: Response) => {
            const query: Record<string, string> = {};

            // const runtime = new ExecutionFlowRuntime(endpoint, this.nodes, params);
            const runtime = new ExecutionQueueRuntime(
                endpoint, 
                this.nodes,
                new RestEndpointRuntimeEnvironment(this.nodes, req, res)
            );

            await runtime.execute();

            // res.status(200).send("HELLO WORLD")
        };


        switch (endpoint.method) {
        case "get":
            return app.get(path, handler);
        case "post":
            return app.post(path, handler);
        default:
            throw new Error(`unimplemented http method handler '${endpoint.method}'`);
        }
    }

    createSources = (app: Express): void => {
        this.sources.forEach(
            (source: EngineNode<SourceNode>) => {
                switch (source.type) {
                case "rest-endpoint":
                    this.createRestEndpoint(app, source);
                }
            }
        );
    }
}

export default Engine;