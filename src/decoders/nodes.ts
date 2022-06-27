import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";
import { ConstantSource, Source } from "./sources";
import { StringValue } from "./values";
import { Condition } from "./conditions";
import { builtins } from "../builtins";

const RestEndpointPathParameterSegment = pipe(
    t.intersection(    [
        t.type({
            source: t.literal("path-parameter"),
            name: t.string
        }),
        t.partial({
            optional: t.boolean
        })]
    )
);

type RestEndpointPathParameterSegment = t.TypeOf<typeof RestEndpointPathParameterSegment>;

const RestEndpointPathSegment = t.union(
    [    RestEndpointPathParameterSegment,
        ConstantSource(StringValue)]
);

type RestEndpointPathSegment = t.TypeOf<typeof RestEndpointPathSegment>;

const TriggerNodeEdge = t.union(
    [  t.type({
        nodeId: t.string,
        trigger: t.union([
            t.literal("on-success"), 
            t.literal("on-failure"), 
            t.literal("on-truthy"), 
            t.literal("on-falsy"),
            t.literal( "always"), 
            t.literal("never")]
        )
    }),
    t.type({
        nodeId: t.string,
        trigger: t.literal("on-condition"),
        condition: Condition
    })]
);

type TriggerNodeEdge = t.TypeOf<typeof TriggerNodeEdge>;

const NodeEdge = t.union(
    [ t.string,
        TriggerNodeEdge
    ]
);

type NodeEdge = t.TypeOf<typeof NodeEdge>;

const BaseNode = <N>(node: t.Type<N>) => pipe(
    t.intersection(
        [
            t.type({
                id: t.string,
                role: t.union([t.literal("source"), t.literal("action")]),
            }),
            node,
            t.partial({
                downstream: t.array(NodeEdge)
            })
        ]
    )
);

const RestEndpointNode = BaseNode(t.type({
    role: t.literal("source"),
    type: t.literal("rest-endpoint"),
    method: t.union([t.literal("get"), t.literal("post")]),
    pathSegments: t.array(RestEndpointPathSegment)
}));

type RestEndpointNode = t.TypeOf<typeof RestEndpointNode>;

const SourceNode = RestEndpointNode;

type SourceNode = t.TypeOf<typeof SourceNode>;

const BuiltInAction = t.type({
    type: t.literal("builtin"),
    builtin: t.keyof(builtins)
});

const CustomAction = t.type({
    type: t.literal("custom"),
    file: t.string
});

const ActionNode = BaseNode(t.type({
    role: t.literal("action"),
    action: t.union([BuiltInAction, CustomAction]),
    inputs: t.union([t.array(Source), t.record(t.string, Source)])
}));

const Node = t.union(   [ RestEndpointNode,  ActionNode]);

type Node = t.TypeOf<typeof Node>

export { Node, ActionNode, SourceNode, NodeEdge, TriggerNodeEdge, RestEndpointNode,
    RestEndpointPathSegment, RestEndpointPathParameterSegment };