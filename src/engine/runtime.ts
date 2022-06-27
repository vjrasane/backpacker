import { isString } from "lodash/fp";
import { SourceNode } from "../decoders/nodes";
import { asyncExec } from "./utils";
import { RuntimeEnvironment } from "./runtime-env";
import { EngineNode, EngineNodeEdge, Status } from "./engine-node";

abstract class ExecutionRuntime {
    protected source: EngineNode<SourceNode>;

    protected nodes: Record<string, EngineNode>

    protected environment: RuntimeEnvironment;

    constructor(
        source: EngineNode<SourceNode>,
        nodes: Record<string, EngineNode>,
        environment: RuntimeEnvironment) {
        this.source = source;
        this.nodes = nodes;
        this.environment = environment;
    }

    abstract execute: () => Promise<void>

    abstract executeOutgoingNodes: (node: EngineNode) => Promise<void>

    isActiveEdge = (edge: EngineNodeEdge, status?: Status): boolean => {
        if (edge.trigger === "always") return true;
        switch (status?.tag) {
        case "success": {
            if (isString(edge)) return true;
            switch (edge.trigger) {
            case "on-success":
                return true;
            case "on-truthy":
                return !!status.result;
            case "on-falsy":
                return !status.result;
            case "on-condition":
                return this.environment.evaluateCondition(edge.condition);
            default:
                return false;
            }
        }
        case "failure":
            return !isString(edge) && edge.trigger === "on-failure";
        default:
            return false;
        }
    }

    executeActionNode = async (node: EngineNode): Promise<void> => {
        this.environment.setNodeStatus(node, { tag: "processing" });
        let result: unknown;

        this.environment.setNodeStatus(node, { tag: "success", result });
    }


    executeNode = async (node: EngineNode): Promise<void> => {
        if (!this.environment.isNodeReady(node)) return;
        try {
            switch (node.role) {
            case "action":
                await this.executeActionNode(node);
                break;
            case "source":
            default:
                this.environment.setNodeStatus(node, { tag: "success", result: {} });
                /* do nothing */
            }
        } catch (error) {
            this.environment.setNodeStatus(node, { tag: "failure", error: error as Error });
        }

        await this.executeOutgoingNodes(node);
    }

}


class ExecutionQueueRuntime extends ExecutionRuntime {
    private executionQueue: Array<EngineNode> = [];

    executeOutgoingNodes = async (node: EngineNode): Promise<void> => {
        if (!this.environment.isNodeReady(node)) return;
        const status = this.environment.getNodeStatus(node);
        this.executionQueue.push(
            ...node.downstream.filter(
                (edge) => this.isActiveEdge(edge, status)
            ).map((edge) => edge.node)
        );
    }

    executionLoop = (): Promise<void> => asyncExec(
        () => {
            const node: EngineNode | undefined = this.executionQueue.shift();
            if (!node) {
                if (this.environment.isProcessing()) return this.executionLoop();
                return;
            }
            this.executeNode(node);
            return this.executionLoop();
        })

    execute = async (): Promise<void> => {
        this.executionQueue.push(this.source);
        await this.executionLoop();
    }
}

// class ExecutionFlowRuntime extends ExecutionRuntime {
//     executeOutgoingNodes = async (node: EngineNode): Promise<void> => {
//         await Promise.all(node.downstream.map(
//             (id: string) => {
//                 const node: EngineNode | undefined = this.nodes[id];
//                 if (!node) throw new Error(`No node found for ID '${id}'`);
//                 return this.executeNode(node);
//             }
//         ));
//     }

//     execute = async () => {
//         await this.executeNode(this.source)
//     }
// }

export { ExecutionRuntime, ExecutionQueueRuntime };