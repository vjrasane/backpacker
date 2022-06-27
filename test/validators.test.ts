import { Range } from "semver";
import { uniqIds, compatibleVersion, validVersion } from "../src/validators/utils";


describe("validators", () => {
    describe("uniqIds", () => {
        it("validates empty array", () => {
            const errors = uniqIds([], []);
            expect(errors.length).toBe(0);
        });

        it("validates array with single value", () => {
            const errors = uniqIds([
                { id: "id" }
            ], []);
            expect(errors.length).toBe(0);
        });

        it("validates array with multiple values", () => {
            const errors = uniqIds([
                { id: "id1" },
                { id: "id2" }
            ], []);
            expect(errors.length).toBe(0);
        });

        it("invalidates array with unique id violation", () => {
            const errors = uniqIds([
                { id: "id1" },
                { id: "id2" },
                { id: "id1" }
            ], []);
            expect(errors).toEqual(
                [{ type: "unique-id-violation", id: "id1", context: [2] }]
            );
        });

        it("invalidates array with multiple id violations", () => {
            const errors = uniqIds([
                { id: "id1" },
                { id: "id2" },
                { id: "id1" },
                { id: "id2" },
            ], []);
            expect(errors).toEqual([
                { type: "unique-id-violation", id: "id1", context: [2] },
                { type: "unique-id-violation", id: "id2", context: [3] }
            ]);
        });

        it("appends context path correctly", () => {
            const errors = uniqIds([
                { id: "id1" },
                { id: "id1" }
            ], ["some", 3, "path"]);
            expect(errors).toEqual(
                [{ type: "unique-id-violation", id: "id1", context: ["some", 3, "path", 1] }]
            );
        });
    });

    describe("validVersion", () => {
        it("accepts valid version", () => {
            const errors = validVersion("1.2.3");
            expect(errors.length).toBe(0);
        });

        it("rejects invalid version", () => {
            const errors = validVersion("not a valid version");
            expect(errors).toEqual(
                [{ type: "invalid-value", value: "not a valid version", context: [] }]
            );
        });
    });

    describe("compatibleVersion", () => {
        it("is compatible with same version", () => {
            const errors = compatibleVersion("1.2.3") ("1.2.3");
            expect(errors.length).toBe(0);
        });
        
        it("is compatible with minor version change", () => {
            const errors = compatibleVersion("1.3.0") ("1.2.3");
            expect(errors.length).toBe(0);
        });

        it("is not compatible with older version", () => {
            const errors = compatibleVersion("1.2.3") ("1.3.0");
            expect(errors).toEqual(
                [{ type: "incompatible-version", version: "1.3.0", current: "1.2.3", 
                    context: [] }]
            );
        });

        it("is not compatible with major version change", () => {
            const errors = compatibleVersion("3.2.1") ("1.2.3");
            expect(errors).toEqual(
                [{ type: "incompatible-version", version: "1.2.3", current: "3.2.1", 
                    context: [] }]
            );
        });

    });
});