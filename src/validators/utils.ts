import { curry, flow, isEqual, uniqBy, map, reverse, isString } from "lodash/fp";
import semver, { Range } from "semver";
import { Node, NodeEdge } from "../decoders/nodes";
import { Identifiable, InvalidReference, InvalidValue, UniqueIdViolation, IncompatibleVersion, ValidationContextPath, ValidationError, Validator } from "./validators";

const compose = <T>(...validators: Array<Validator<T>>): Validator<T> => (
    value: T, context: ValidationContextPath = []): ValidationError[] => {
    const [validator, ...rest] = validators;
    if (!validator) return [];
    const errors = validator(value, context);
    return errors.length 
        ? errors 
        : compose(...rest)(value, context);
};

const validVersion: Validator<string> = (version: string, context: ValidationContextPath = []): InvalidValue[]  => 
    semver.valid(version) ? [] :
        [{ type: "invalid-value", value: version, context }];

const isCompatibleVersion = (current: string, previous: string) => semver.satisfies(current, new Range(`^${previous}`));

const compatibleVersion = (current: string): Validator<string> => (
    version: string, context: ValidationContextPath = []
): IncompatibleVersion[] =>  isCompatibleVersion(current, version) ? [] : 
    [{ type: "incompatible-version", 
        version,
        current,
        context }];


const duplicatesBy = curry(<V, I>(accessor: (value: V) => I, array: V[]) => array.filter(
    (first: V, firstIndex: number) => array.some(
        (second: V, secondIndex: number) => firstIndex !== secondIndex
            && isEqual(accessor(first), accessor(second))
    )
));

const uniqFields = <A>(field: keyof A): Validator<A[], UniqueIdViolation> => (objects, context = []) =>
    flow(
        (values: A[]) => values.map((value, index) => [value, index]),
        duplicatesBy(([value]: [A, number]) => value[field]),
        reverse, uniqBy(([value]: [A, number]) => value[field]), reverse,
        map(([value, index]: [Identifiable, number]): UniqueIdViolation => (
            { type: "unique-id-violation", id: value.id, context: [...context, index] }
        )),
    )(objects);

const uniqIds: Validator<Identifiable[], UniqueIdViolation> = (identifiables, context = []) =>
    flow(
        (values: Identifiable[]) => values.map((value, index) => [value, index]),
        duplicatesBy(([value]: [Identifiable, number]) => value.id),
        reverse, uniqBy(([value]: [Identifiable, number]) => value.id), reverse,
        map(([value, index]: [Identifiable, number]): UniqueIdViolation => (
            { type: "unique-id-violation", id: value.id, context: [...context, index] }
        )),
    )(identifiables);

const validEdges: Validator<Node[], InvalidReference> = (nodes, context = []) =>
    nodes.flatMap(
        (node: Node, nodeIndex: number): InvalidReference[] => node.downstream?.flatMap(
            (edge: NodeEdge, edgeIndex: number): InvalidReference[] => {
                const targetId = 
                    isString(edge) ? edge : edge.nodeId;
                    
                if (nodes.some(({ id }) => id === targetId)) return [];
                return [
                    { type: "invalid-reference", ref: targetId, context: [...context, nodeIndex, "downstream", edgeIndex] }
                ];
            }
        ) || []
    );


const validate = <T>(value: T, validator: Validator<T>): T => {
    const errors: ValidationError[] = validator(value);
    if (!errors.length) return value;
    throw new Error(`Validation errors: ${JSON.stringify(errors, undefined, 2)}`);
};

export { compose, duplicatesBy, uniqIds, uniqFields, validate, validEdges, compatibleVersion, validVersion };