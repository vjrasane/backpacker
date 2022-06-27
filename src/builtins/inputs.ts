
import { FromSchema, JSONSchema } from "json-schema-to-ts";

type SchemaInput = {
    tag: "schema",
    schema: JSONSchema
}

type ExpressionInput = {
    tag: "expression",
}

type NodeInput = SchemaInput | ExpressionInput;

type TypeOfInput<I> = 
    I extends SchemaInput ? FromSchema<I["schema"]> : 
    (I extends ExpressionInput ? boolean 
            : never)

type TypeOfInputs<A extends Readonly<Array<NodeInput>>> = { [P in keyof A]: TypeOfInput<A[P]> }

// const asd = [{
//     tag: "schema",
//     schema: {
//         type: "string"
//     }
// },
// {
//     tag: "schema",
//     schema: {
//         type: "number"
//     }
// }] as const;

// type A = TypeOfInputs<typeof asd>;

// type Asd = typeof asd

// type SchemaInput = {
//     readonly source: "schema",
//     readonly schema: JSONSchema
// }

// type ExpressionInput = {
// 	readonly source: "expression",
// 	readonly sce
// }

// type ConditionInput = {
//     readonly source: "condition",
//     readonly condition: Condition<SchemaInput>
// }

// type NodeInput = ConditionInput | SchemaInput;


// type TypeOfComparison<C extends ComparisonCondition<SchemaInput>> = Omit<C, "values"> & 
//  { values: [FromSchema<C["values"][0]["schema"]>, FromSchema<C["values"][1]["schema"]>] };

// type TypeOfLogical<C extends LogicalCondition<SchemaInput>> = Omit<C, "conditions"> & {
//     conditions: [TypeOfCondition<C["conditions"][0]>, TypeOfCondition<C["conditions"][0]>]
// }

// type TypeOfCondition<C extends Condition<SchemaInput>> = 
//     C extends ComparisonCondition<SchemaInput>     ? TypeOfComparison<C> 
//     : (C extends LogicalCondition<SchemaInput> ? TypeOfLogical<C> : never)

// type TypeOfConditionInput<C extends ConditionInput> = TypeOfCondition<C["condition"]>

// type TypeOfInput<I extends NodeInput> = I extends NodeInput ? (
//     I extends SchemaInput ? FromSchema<I["schema"]> :
//     (I extends ConditionInput ? TypeOfConditionInput<I> : never)
//     ) : never;

export { NodeInput, TypeOfInput, TypeOfInputs };