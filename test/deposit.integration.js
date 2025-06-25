const { expect } = require("chai");
const { ethers } = require("hardhat");
const { prove } = require("./prove.helper");
const snarkjs = require("snarkjs");
const { prepareInput } = require("./hashes.helper");

describe("Deposit On-chain PLONK Verify", function () {
    let Verifier;
    before(async () => {
        const F = await ethers.getContractFactory("Deposit3Verifier");
        Verifier = await F.deploy();
    });

    it("verifies good proof", async function () {
        this.timeout(100000);
        const input = await prepareInput(`./vectors/deposit_good.json`);
        const { proof, publicSignals } = await prove(input, "deposit_3");
        const calldata = await snarkjs.plonk.exportSolidityCallData(
            proof,
            publicSignals
        );

        // Extract the two arrays from the calldata string
        // Format: [proofArray][publicInputsArray]
        const match = calldata.match(/^\[(.*)\]\[(.*)\]$/);
        if (!match) {
            throw new Error("Invalid calldata format");
        }

        const proofData = JSON.parse(`[${match[1]}]`);
        const pubInputs = JSON.parse(`[${match[2]}]`);

        console.log(`pubInputs: ${JSON.stringify(pubInputs)}`);

        expect(await Verifier.verifyProof(proofData, pubInputs)).to.equal(true);
    });

    it("rejects tampered proof", async () => {
        this.timeout(100000);
        const input = await prepareInput(`./vectors/deposit_good.json`);
        const { proof, publicSignals } = await prove(input, "deposit_3");
        publicSignals[0] = (BigInt(publicSignals[0]) + 1n).toString();
        const calldata = await snarkjs.plonk.exportSolidityCallData(
            proof,
            publicSignals
        );

        // Extract the two arrays from the calldata string
        // Format: [proofArray][publicInputsArray]
        const match = calldata.match(/^\[(.*)\]\[(.*)\]$/);
        if (!match) {
            throw new Error("Invalid calldata format");
        }

        const proofData = JSON.parse(`[${match[1]}]`);
        const pubInputs = JSON.parse(`[${match[2]}]`);

        expect(await Verifier.verifyProof(proofData, pubInputs)).to.equal(
            false
        );
    });
});
