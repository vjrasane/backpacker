
import { NodeDefinition, NodeFunction } from "./definition";

const inputs = {
    milliseconds: {
        type: "schema",
        schema: {
            type: "integer"
        }
    }
} as const;


const sleep: NodeFunction<typeof inputs> = ({ inputs }) => 
    new Promise((resolve) => setTimeout(resolve, inputs.milliseconds));

const definition: NodeDefinition<typeof inputs> = {
    function: sleep,
    inputs
};

export default definition;