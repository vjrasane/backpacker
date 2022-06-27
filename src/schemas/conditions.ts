import { FromSchema, JSONSchema } from "json-schema-to-ts";
import { JSONSchema6Definition } from "json-schema";


const logicalConditionSchema = (): JSONSchema => ({
    type: "object",
    properties: {
        operator: { oneOf: [{ const: "and" }, { const: "or" }] },
        conditions: { type: "array", 
            maxItems: 2,
            minItems: 2,
            items: [conditionSchema, conditionSchema],
            additionalItems: false
        }
    },
    additionalProperties: false,
    required: ["operator", "conditions"]
});

const comparisonConditionSchema = {
    type: "object",
    properties: {
        operator: { oneOf: [{ const: "eq" }, { const: "neq" }, { const: "lt" },
            { const: "gt" }, { const: "gte" }, { const: "lte" }] },
        conditions: { type: "array", 
            maxItems: 2,
            minItems: 2,
            items: [{}, {}],
            additionalItems: false
        }
    },
    additionalProperties: false,
    required: ["operator", "conditions"]
} as const;


type ComparisonCondition = FromSchema<typeof comparisonConditionSchema>

const conditionSchema = {
    oneOf: [
        // logicalConditionSchema(),
        comparisonConditionSchema,
    ]
} as const;

const lol = logicalConditionSchema() as const;

type Asd = FromSchema<typeof lol>;

type Condition = FromSchema<typeof conditionSchema>