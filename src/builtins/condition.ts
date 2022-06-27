
import { string } from "fp-ts";
import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { first } from "lodash/fp";
import { ComparisonCondition, Condition, getComparisonFunction, LogicalCondition } from "../decoders/conditions";
import { NodeDefinition, NodeFunction } from "./definition";
import { NodeInput } from "./inputs";

// type NodeInputs = Record<string, NodeInput>;

// const evaluateCondition = (condition: Condition): boolean => {
// 	switch (condition.operator) {
// 	case "and": {
// 		const [left, right] = condition.conditions;
// 		return evaluateCondition(left) && evaluateCondition(right);
// 	}
// 	case "or": {
// 		const [left, right] = condition.conditions;
// 		return evaluateCondition(left) || evaluateCondition(right);
// 	}
// 	default:{
// 		const [left, right] = condition.sources;
// 		return getComparisonFunction(condition.operator)(
// 			evaluateSource(left),
// 			evaluateSource(right)
// 		);
// 	}
// 	}
// }

const inputs = [{
    type: "expression"
}] as const;

const output = {
    type: "boolean"
} as const;

const condition: NodeFunction<typeof inputs, typeof output> = ({ inputs }) => {
    return inputs[0];
// switch (inputs.operator) {
// 	case "and": {
// 		const [left, right] = inputs.conditions;
// 		return evaluateCondition(left) && this.evaluateCondition(right);
// 	}
// 	case "or": {
// 		const [left, right] = condition.conditions;
// 		return this.evaluateCondition(left) || this.evaluateCondition(right);
// 	}
// 	default:{
// 		const [left, right] = condition.sources;
// 		return getComparisonFunction(condition.operator)(
// 			this.evaluateSource(left),
// 			this.evaluateSource(right)
// 		);
// 	}
// 	}
// );
};

const definition: NodeDefinition<typeof inputs, typeof output> = {
    function: condition,
    inputs,
    output
};

export default definition;