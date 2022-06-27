import { Value } from "./values";
import * as t from "io-ts";
import { pipe } from "fp-ts/lib/function";


type ConstantSource<V extends Value> = {
    source: "constant"
} & V

const ConstantSource = <V extends Value>(value: t.Type<V>): t.Type<ConstantSource<V>> => pipe(
    t.intersection([
        t.type({
            source: t.literal("constant")
        }),
        value
    ])
);

const PathParameterSource = t.type({
    source: t.literal("path-parameter"),
    name: t.string 
});

type PathParameterSource = t.TypeOf<typeof PathParameterSource>

const QueryParameterSource = t.type({
    source: t.literal("query-parameter"),
    name: t.string
});

const NodeStatusSource = t.type({
    source: t.literal("node-status"),
    nodeId: t.string,
});

const NodeResultSource = t.type({
    source: t.literal("node-result"),
    nodeId: t.string,
});

const NodeErrorSource = t.type({
    source: t.literal("node-error"),
    nodeId: t.string,
});

const CurrentTimeSource = t.type({
    source: t.literal("current-time"),
});

const Source = t.union([ConstantSource(Value), PathParameterSource, QueryParameterSource, 
    NodeStatusSource, NodeErrorSource, NodeResultSource, CurrentTimeSource ]);

type Source = t.TypeOf<typeof Source>

export { Source, ConstantSource, PathParameterSource, QueryParameterSource, NodeResultSource };
