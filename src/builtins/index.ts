import condition from "./condition";
import logger from "./logger";
import _throw from "./throw";
import respond from "./respond";
import sleep from "./sleep";

const builtins = {
    condition, 
    logger,
    respond,
    sleep,
    throw: _throw
} as const;

type BuiltIn = keyof typeof builtins;

const isBuiltIn = (tag: string): tag is BuiltIn => tag in builtins;

const getBuiltIn = <T extends BuiltIn>(tag: T): (typeof builtins)[T] => {
    return builtins[tag];
};

export { BuiltIn, isBuiltIn, getBuiltIn, builtins };