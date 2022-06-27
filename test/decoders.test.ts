import { System } from "../src/decoders/system";
import { decode } from "../src/decoders/utils";


describe("decoders", () => {
    it("decodes empty system", () => {
        const system: System = decode(System, { version: "1.0.0", groups: [] });
        expect(system).toBeTruthy();
    });

    it("throws error for invalid input", () => {
        expect(() => decode(System, {})).toThrowError(/Decoding error:/);
    });
});