
import express, { Express, Request, Response } from "express";
import { flow, map, fromPairs, isString } from "lodash/fp";
import { v4 as uuidv4 } from "uuid";
import Engine from "./src/engine/engine";
import { HTTPMethod } from "http-method-enum";
import { System } from "./src/decoders/system";
import { pipe } from "fp-ts/lib/function";
import { fold } from "fp-ts/lib/Either";
import * as t from "io-ts";
import * as D from "io-ts/Decoder";
import { decode } from "./src/decoders/utils";
import { systemValidator } from "./src/validators/system";
import { validate } from "./src/validators/utils";

const app = express();


const systemStartup = (input: unknown) => {
    const system: System = pipe(
        decode(System, input),
        (system: System) => validate(system, systemValidator)
    );
    
    const engines = system.groups.map(
        (group) => new Engine(group.nodes)
    );

    engines.forEach(engine => engine.createSources(app));

    app.listen(3030, () => console.log("listening"));
};

const system: System = {
    groups: [
        {
            id: "group",
            nodes: [{
                id: "source",
                role: "source",
                type: "rest-endpoint",
                method: "get",
                pathSegments: [
                    { source: "constant", type: "string", value: "api" },
                    { source: "path-parameter", name: "whatever" }
                ],
                downstream: ["sleep1", "sleep2"]
            },
            {
                id: "sleep1",
                role: "action",
                action: {
                    type: "builtin",
                    builtin: "sleep",
                },
                inputs: {
                    milliseconds: { source: "constant", type: "number", value: 2000 }
                },
                downstream: ["condition", "throw"]
            },
            {
                id: "sleep2",
                role: "action",
                action: {
                    type: "builtin",
                    builtin: "sleep",
                },
                inputs: {
                    milliseconds: { source: "constant", type: "number", value: 2000 },
                },
                downstream: ["logger"]
            },
            {
                id: "throw",
                role: "action",
                action: {
                    type: "builtin",
                    builtin: "throw",
                },
                inputs: {
                    message: { source: "constant", type: "string", value: "TEST ERROR" },
                },
                downstream: [{ nodeId: "log-error", trigger: "on-failure" }]
            },
            {
                id: "log-error",
                role: "action",
                action: {
                    type: "builtin",
                    builtin: "logger",
                },
                inputs: [
                    { source: "node-error", nodeId: "throw" }
                ]
            },
            {
                id: "condition",
                role: "action",
                action: {
                    type: "builtin",
                    builtin: "condition",
                },
                inputs: [{ source: "constant", type: "boolean", value: false}],
                downstream: ["logger", { nodeId: "true", trigger: "on-truthy" }, { nodeId: "false", trigger: "on-falsy" }]
            },
            {
                id: "true",
                role: "process",
                type: "logger",
                inputs: [
                    { source: "constant", type: "string", value: "TRUE" }
                ]
            },
            {
                id: "false",
                role: "process",
                type: "logger",
                inputs: [
                    { source: "constant", type: "string", value: "FALSE" }
                ]
            },
            {
                id: "logger",
                role: "process",
                type: "logger",
                inputs: [
                    { source: "constant", type: "string", value: "log something" },
                    { source: "path-parameter", name: "whatever" },
                    { source: "node-result", nodeId: "condition" }
                ],
                downstream: ["respond"]
            }, {
                id: "respond",
                role: "process",
                type: "respond",
                response: {
                    source: "node-result", nodeId: "condition"
                },
                downstream: ["respond2"]
            },
            {
                id: "respond2",
                role: "process",
                type: "respond",
                response: {
                    source: "constant",
                    type: "string",
                    value: "hello world"
                },
                downstream: [{ nodeId: "logger2", trigger: "never" }]
            },
            {
                id: "logger2",
                role: "process",
                type: "logger",
                inputs: [
                    { source: "node-result", nodeId: "respond2" }
                ]
            }
            ]
        }
    ]
};

systemStartup(system);