import { NodeDefinition, NodeFunction } from "./definition";

const inputs = {
    response: {
        type: "schema",
        schema: {}
    }
} as const;

const respond: NodeFunction<typeof inputs, undefined, "response"> = ({ inputs, response }) => {
    response.status(200).send(inputs.response);
};

const definition: NodeDefinition<typeof inputs, undefined, ["response"]> = {
    function: respond,
    inputs,
    contexts: ["response"]
};

export default definition;