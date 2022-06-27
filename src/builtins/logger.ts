import { NodeDefinition, NodeFunction } from "./definition";

const inputs = [{
    type: "schema",
    schema: {
        type: "array"
    }
}] as const;

const logger: NodeFunction<typeof inputs> = ({ inputs }) => {
    console.log(...inputs);
};

const definition: NodeDefinition<typeof inputs> = {
    function: logger,
    inputs
};

export default definition;