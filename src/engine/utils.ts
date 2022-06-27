import {  RestEndpointPathSegment, SourceNode } from "../decoders/nodes";
import { EngineNode } from "./engine-node";


const asyncExec = async <T>(func: () => T | Promise<T>): Promise<T> => new Promise(
    (resolve) => setImmediate(() => resolve(func()))
);


const endpointPathSegmentToString = (segment: RestEndpointPathSegment) => {
    switch (segment.source) {
    case "constant":
        return segment.value;
    case "path-parameter":
        return ":" + segment.name;
    }
};

const isSource = (node: EngineNode): node is EngineNode<SourceNode> => node.role === "source";

export { isSource, asyncExec, endpointPathSegmentToString };