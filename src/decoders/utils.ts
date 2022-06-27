

import * as t from "io-ts";
import { PathReporter } from "io-ts/PathReporter";
import { pipe } from "fp-ts/lib/function";
import { Either, fold, getOrElseW, isLeft, mapLeft } from "fp-ts/lib/Either";
import { formatValidationErrors } from "io-ts-reporters";
import { Reporter } from "io-ts/lib/Reporter";

type ValidationError = {
    actual: unknown,
    message?: string,
    context: string[]
}

function getContextPath(context: t.Context): string[] {
    return context.map(({ key, type }) => key);
}
/**
 * @since 1.0.0
 */
export function failure(es: t.Errors): Array<ValidationError> {
    return es.map((e) => ({message:e.message, actual: e.value, context: getContextPath(e.context) }));
}
    


const decode = <T>(decoder: t.Type<T>, input: unknown): T =>     pipe(
    decoder.decode(input),
    mapLeft(failure),
    getOrElseW(
        (errors: ValidationError[]) => {
            throw new Error(`Decoding error: ${JSON.stringify(errors, undefined, 2)}`);
        }
    )
);

export { decode };