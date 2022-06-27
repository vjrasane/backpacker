/* eslint-disable @typescript-eslint/ban-types */
import { Response, Request } from "express";
import { JSONSchema, FromSchema } from "json-schema-to-ts";

type SchemaInput = {
    type: "schema",
    schema: JSONSchema
}

type ExpressionInput = {
    type: "expression",
}

type NodeInput = SchemaInput | ExpressionInput;

type NodeInputs = Readonly<Array<NodeInput>> | Readonly<Record<string, NodeInput>>;

type TypeOfInput<I> = 
    I extends SchemaInput ? FromSchema<I["schema"]> : 
    (I extends ExpressionInput ? boolean 
            : never)

type TypeOfInputs<A extends NodeInputs> = { [P in keyof A]: TypeOfInput<A[P]> }

type NodeRuntimeContext = "response" | "request" | undefined

type NodeFunctionParameters<I, C extends NodeRuntimeContext> = 
    (C extends "response" ? { response: Response } : {}) &
    (C extends "request" ? { request: Request } : {}) &
    ({ inputs: { [P in keyof I]: I[P] } })

interface NodeFunctionInner<
    I, 
    O = void,  
    C extends NodeRuntimeContext = undefined> {
        (params: NodeFunctionParameters<I, C>): O
    }

// type BuiltinNodeFunction<
//     I extends Any = Type<unknown, unknown, unknown>, 
//     O extends Any = Type<void, unknown, unknown>, 
//     C extends NodeRuntimeContext = undefined> = NodeFunction<TypeOf<I>, TypeOf<O>, C>;

// type CustomNodeFunction<
// I = Record<string, unknown>, 
// O = void, 
// C extends NodeRuntimeContext = undefined> = NodeFunction<FromSchema<I>, FromSchema<O>, C>;

type NodeFunction<
I extends NodeInputs = [], 
O = undefined, 
C extends NodeRuntimeContext = undefined
> = NodeFunctionInner<TypeOfInputs<I>, 
    O extends undefined ? void : FromSchema<O>, 
    C>

type NodeDefinition<
I extends NodeInputs = [], 
O = undefined, 
C extends Array<NodeRuntimeContext> | undefined = undefined> = 
    (C extends Array<NodeRuntimeContext> ? {
        function: NodeFunction<I, O, C[number]>,
        contexts: C
    } : {
        function: NodeFunction<I, O>,
    }) &
    ({ inputs: I }) &
    (O extends undefined ? {} : { output: O })

// interface NodeDefinition<
//     I = Record<string, unknown>, 
//     O = void
// > {
//     function: NodeFunction<I, O>,
//     inputSchema?: JSONSchema,
//     outputSchema?: JSONSchema
// }

// interface BuiltinNodeDefinition<
//     I extends Any = Type<unknown, unknown, unknown>, 
//     O extends Any = Type<void, unknown, unknown>, 
//     C extends Array<NodeRuntimeContext> = []> extends NodeDefinition<TypeOf<I>, TypeOf<O>, C> {
//         inputDecoder?: I,
//         outputDecoder?: O
//     }

// interface CustomNodeDefinition<
//     I = Record<string, unknown>, 
//     O = void, 
//     C extends Array<NodeRuntimeContext> = []> extends NodeDefinition<FromSchema<I>, FromSchema<O>, C> 
//     {
//         inputSchema?: JSONSchema,
//         outputSchema?: JSONSchema 
//     }



export { NodeFunction, NodeFunctionParameters , NodeDefinition, 
   
    TypeOfInputs, TypeOfInput, NodeFunctionInner
    // CustomNodeDefinition, BuiltinNodeDefinition, CustomNodeFunction, BuiltinNodeFunction 
};