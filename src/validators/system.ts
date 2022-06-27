import { NodeGroup, System } from "../decoders/system";
import { uniqIds, validEdges, validVersion, compatibleVersion, compose } from "./utils";
import { ValidationContextPath, ValidationError, Validator } from "./validators";

import pkg from "../../package.json";

const groupValidator: Validator<NodeGroup> = (group: NodeGroup, context: ValidationContextPath = []): ValidationError[] => {
    return [
        ...uniqIds(group.nodes, [...context, "nodes"]),
        ...validEdges(group.nodes, [...context, "nodes"])
    ];
};

const systemValidator: Validator<System> = (system: System): ValidationError[] => {
    return [
        ...compose(            
            validVersion, compatibleVersion(pkg.version)
        )(system.version, ["version"]),
        ...uniqIds(system.groups, ["groups"]),
        ...system.groups.flatMap(
            (group: NodeGroup, index: number) =>  groupValidator(group, ["groups", index])
        )
    ];
};

export { systemValidator };