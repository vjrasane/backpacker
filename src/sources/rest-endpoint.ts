

// import { parse, Token, Key } from "path-to-regexp";

// // // interface ParamsDictionary {
// // //     [key: string]: string;
// // // }

// // // type RemoveTail<S extends string, Tail extends string> = S extends `${infer P}${Tail}` ? P : S;
// // // type GetRouteParameter<S extends string> = RemoveTail<
// // //     RemoveTail<RemoveTail<S, `/${string}`>, `-${string}`>,
// // //     `.${string}`
// // // >;

// // // // prettier-ignore
// // // type RouteParameters<Route extends string> = string extends Route
// // //     ? ParamsDictionary
// // //     : Route extends `${string}(${string}`
// // //         ? ParamsDictionary //TODO: handling for regex parameters
// // //         : Route extends `${string}:${infer Rest}`
// // //             ? (
// // //             GetRouteParameter<Rest> extends never
// // //                 ? ParamsDictionary
// // //                 : GetRouteParameter<Rest> extends `${infer ParamName}?`
// // //                     ? { [P in ParamName]?: string }
// // //                     : { [P in GetRouteParameter<Rest>]: string }
// // //             ) &
// // //             (Rest extends `${GetRouteParameter<Rest>}${infer Next}`
// // //                 ? RouteParameters<Next> : unknown)
// // //             : {};

// // // type Params = RouteParameters<"/asd/:dhasd">

// // // const segments = parse("/route/:foo/(.*)");

// type FilterType<T extends unknown[], F> = T extends [] ? [] :
//     T extends [infer H, ...infer R] ?
//     H extends F ? FilterType<R, F> : [H, ...FilterType<R, F>] : T;

// type Asd = [number, never, string]

// type F = FilterType<[1, 2, number, string], undefined>;

// // const assert = <T>(value: T) => { return undefined; };

// // const arr: [number, string] = [0, "str"];

// // assert<F>(arr);

// type SegmentParameter<T extends Token> = T extends Key 
//     ? T["name"] extends string ? { [P in T["name"]]: P }
//     : undefined : undefined

// type PathParameters<T> = 
//     T extends [] ? {}
//         : (T extends readonly [infer H, ...infer R] ? 
//             (H extends { name: string } ? { [P in typeof H["name"]]: string } & PathParameters<R> : PathParameters<R>) : {})
// // (H extends Key ? [H["name"] , ...PathParameters<R>] : PathParameters<R>)
//         // : T)
// // )
    
    
// // H extends Key
// //     ? [ H["name"] , ...PathParameters<R>]
// //     : PathParameters<R>
// // : []

// // FilterType<{ -readonly [P in keyof T]: SegmentParameter<T[P]> }, undefined>;

// // // type Array<A extends T[], T extends Token> = A extends [T, ...T[]] 
// // //     ? [SegmentParameter<T>, ...Array<R, T>]
// // //     : []

// // // name: string | number;
// // // prefix: string;
// // // suffix: string;
// // // pattern: string;
// // // modifier: string;

// const segment =  { name: "bar", prefix: "", suffix: "", pattern: "", modifier: "" };

// type S = SegmentParameter<typeof segment>;

// const segments = [
//     "foo",
//     segment
// ] as const;

// type PT = PathParameters<typeof segments>

// // type RT = AAA<typeof segments>

// // type UndefIndex<T extends any[], I extends number> = {
// //     [ P in keyof T ] : P extends Exclude<keyof T, keyof any[]> ? P extends `${I}` ? undefined : T[P] : T[P]
// // }

// // type SpliceTuple<T extends any[], I extends number> = FilterType<UndefIndex<T, I>, undefined>;


// // type FilterUndefined<T extends any[]> = T extends [] ? [] :
// //     T extends [infer H, ...infer R] ?
// //     H extends undefined ? FilterUndefined<R> : [H, ...FilterUndefined<R>] : T;

// // type f = FilterType<[1,2,3,number, undefined], undefined>