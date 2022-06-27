import * as t from "io-ts";
import { Source } from "./sources";

type LogicalCondition<T> = {
    readonly operator: "and" | "or"
    readonly conditions: readonly [Condition<T>, Condition<T>]
}

type ComparisonCondition<T> = {
    readonly operator: "eq" | "neq" | "lt" | "gt" | "gte" | "lte",
    readonly values: readonly [T, T]
}

type Condition<T> = LogicalCondition<T> | ComparisonCondition<T>

const Condition: t.Type<Condition<Source>> = t.recursion("Condition", () => 
    t.union([        LogicalCondition,    ComparisonCondition]));

const LogicalCondition: t.Type<LogicalCondition<Source>> = t.type({
    operator: t.union([t.literal("and"), t.literal("or")]),
    conditions: t.readonly(t.tuple([Condition, Condition]))
});

const ComparisonCondition: t.Type<ComparisonCondition<Source>> = t.type({
    operator: t.union(
        [ t.literal("eq"), t.literal("neq"), t.literal("lt"), t.literal("gt"), t.literal("gte"), t.literal("lte")]),
    values: t.readonly(t.tuple([Source, Source]))
});

type ComparisonFunction = (left: any, right: any) => boolean;

const getComparisonFunction = (operator:  ComparisonCondition<unknown>["operator"]): ComparisonFunction  => {
    switch(operator) {
    case "eq":
        return (left: any, right: any) => left === right;
    case "neq":
        return (left: any, right: any) => left !== right;
    case "lt":
        return (left: any, right: any) => left < right;
    case "lte":
        return (left: any, right: any) => left <= right;
    case "gt":
        return (left: any, right: any) => left > right;
    case "gte":
        return (left: any, right: any) => left >= right;
    }
};

export { Condition, ComparisonCondition, LogicalCondition, getComparisonFunction };