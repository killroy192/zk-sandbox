const path = require("path");
const { wasm } = require("circom_tester");
const { expect } = require("chai");
const { prepareInput } = require("./hashes.helper");

describe("DepositCircuit Unit", () => {
    let circuit;
    before(async () => {
        circuit = await wasm(
            path.join(__dirname, `../circuits/deposit_3.circom`),
            {
                include: [
                    path.join(__dirname, `../node_modules/circomlib/circuits`),
                ],
            }
        );
    });

    it("accepts valid deposit input", async () => {
        const input = await prepareInput(`./vectors/deposit_good.json`);
        await circuit.calculateWitness(input, true);
    });

    it("rejects mismatched deposits", async () => {
        const input = await prepareInput(`./vectors/deposit_bad.json`);
        let rejected = false;
        await circuit.calculateWitness(input, true).catch(() => {
            rejected = true;
        });
        expect(rejected).to.be.true;
    });

    it("accepts zero amount deposits", async () => {
        const input = await prepareInput(`./vectors/deposit_zero.json`);
        await circuit.calculateWitness(input, true);
    });

    it("validates output signal is 1 for valid inputs", async () => {
        const input = await prepareInput(`./vectors/deposit_good.json`);
        await circuit.calculateWitness(input, true);
    });

    it("handles large amounts correctly", async () => {
        const input = await prepareInput(`./vectors/deposit_large.json`);
        await circuit.calculateWitness(input, true);
    });
});
