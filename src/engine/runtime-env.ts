import { Source } from "../decoders/sources";
import { EngineNode, Status } from "./engine-node";
import { mapValues, values } from "lodash/fp";
import { Condition, getComparisonFunction } from "../decoders/conditions";
import { Request, Response } from "express";

abstract class RuntimeEnvironment {
    protected statuses: Record<string, Status>;

    constructor(
        nodes: Record<string, EngineNode>
    ) {
        this.statuses = mapValues(
            () => ({ tag: "reachable" }), nodes 
        ) as Record<string, Status>;
    }

    isProcessing = (): boolean => values(this.statuses).some(
        (status: Status) => status.tag === "processing"
    );

    isNodeReady = (node: EngineNode): boolean => !node.upstream.some(
        /* TODO: execution policies */
        (up: EngineNode) =>  this.statuses[up.id]?.tag !== "success"   
    );

    getNodeStatus = (node: EngineNode): Status | undefined => this.statuses[node.id];

    setNodeStatus = (
        node: EngineNode, status: Status): void => {
        this.statuses = { ...this.statuses, [node.id]: status };
    }

    evaluateCondition = (condition: Condition<any>): boolean => {
        switch (condition.operator) {
        case "and": {
            const [left, right] = condition.conditions;
            return this.evaluateCondition(left) && this.evaluateCondition(right);
        }
        case "or": {
            const [left, right] = condition.conditions;
            return this.evaluateCondition(left) || this.evaluateCondition(right);
        }
        default:{
            const [left, right] = condition.values;
            return getComparisonFunction(condition.operator)(
                this.evaluateSource(left),
                this.evaluateSource(right)
            );
        }
        }
    }

    protected abstract evaluateEnvironmentSource: (source: Source) => unknown;

    abstract respond: (result: Status["tag"], source: Source) => void;

    evaluateSource = (source: Source): unknown => {
        switch (source.source) {
        case "constant":
            return source.value;
        case "current-time":
            return new Date();
        case "node-status": {
            return this.statuses[source.nodeId];
        }
        case "node-result": {
            const status: Status | undefined = this.statuses[source.nodeId];
            if (status.tag !== "success") return undefined;
            return status.result;
        }
        case "node-error": {
            const status: Status | undefined = this.statuses[source.nodeId];
            if (status.tag !== "failure") return undefined;
            return status.error;
        }
        default:
            return this.evaluateEnvironmentSource(source);
        }
    }
}

class RestEndpointRuntimeEnvironment extends RuntimeEnvironment {
    protected request: Request;

    protected response: Response;

    constructor(
        nodes: Record<string, EngineNode>,
        request: Request,
        response: Response) {
        super(nodes);
        this.request = request;
        this.response = response;
    }

    evaluateEnvironmentSource = (source: Source): unknown => {
        switch (source.source) {
        case "path-parameter":
            return this.request.params[source.name];
        case "query-parameter":
            return this.request.query[source.name];
        default:
            throw new Error(`Unsupported source type: '${source.source}'`);
        }
    }

    respond = (result: Status["tag"], source: Source): Response => {
        const response = this.evaluateSource(source);
        switch(result) {
        case "success":
            return this.response.status(200).send(response);
        case "failure":
        default:
            return this.response.status(500).send(response);
        }
    }
}

export { RestEndpointRuntimeEnvironment, RuntimeEnvironment };