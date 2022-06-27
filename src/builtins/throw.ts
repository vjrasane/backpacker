
import { NodeDefinition, NodeFunction } from "./definition";

const inputs = {
    message: {
        type: "schema",
        schema: {
            type: "string" 
        }
    }
} as const;

const _throw: NodeFunction<typeof inputs> = ({ inputs }) => 
{ throw new Error(inputs.message); };

const definition: NodeDefinition<typeof inputs> = {
    function: _throw,
    inputs
};

export default definition;