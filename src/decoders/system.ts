import * as t from "io-ts";
import { Node } from "./nodes";

const NodeGroup = (
    t.type({
        id: t.string,
        nodes: t.array(Node)
    }, "NodeGroup")
);

type NodeGroup = t.TypeOf<typeof NodeGroup>;

const System =  t.type({
    version: t.string,
    groups: t.array(NodeGroup),
}, "System");


type System = t.TypeOf<typeof System>

export { System, NodeGroup };