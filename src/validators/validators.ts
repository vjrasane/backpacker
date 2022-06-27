import { Range } from "semver";

type ValidationContextPath = (string | number)[]

// type SystemValidationContext = {
//     tag: "system",
//     path: ValidationContextPath
// }

// type NodeGroupValidationContext = {
//     tag: "node-group",
//     groupId: string,
//     path: ValidationContextPath
// }

// type NodeValidationContext = {
//     tag: "node",
//     nodeId: string,
//     path: ValidationContextPath
// }

// type ValidationContext = SystemValidationContext | NodeGroupValidationContext | NodeValidationContext;



type UniqueIdViolation = {
    type: "unique-id-violation"
    id: string
    context: ValidationContextPath
}

type InvalidReference= {
    type: "invalid-reference",
    ref: string,
    context: ValidationContextPath
}

type InvalidValue = {
    type: "invalid-value",
    value: unknown,
    context: ValidationContextPath
}

type IncompatibleVersion = {
    type: "incompatible-version",
    version: string,
    current: string,
    context: ValidationContextPath
}

type ValidationError = UniqueIdViolation | InvalidReference | IncompatibleVersion | InvalidValue;

type Validator<T, E extends ValidationError = ValidationError> = (value: T, context?: ValidationContextPath) => E[]

interface Identifiable {
    id: string
}

export { Identifiable, Validator, ValidationError, ValidationContextPath, UniqueIdViolation, InvalidReference,

    IncompatibleVersion, InvalidValue };