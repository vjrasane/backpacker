
import * as t from "io-ts";

const StringValue = t.type({
    type: t.literal("string"),
    value: t.string
});

type StringValue = t.TypeOf<typeof StringValue>;

const NumberValue = t.type({
    type: t.literal("number"),
    value: t.number
});

const BooleanValue = t.type({
    type: t.literal("boolean"),
    value: t.boolean
});
    
const Value = t.union([
    StringValue, NumberValue, BooleanValue]);

type Value = t.TypeOf<typeof Value>

export { Value, StringValue };