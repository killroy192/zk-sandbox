const { buildPoseidon } = require("circomlibjs");
const fs = require("fs");
const path = require("path");
const promisify = require("util").promisify;
const writeFile = promisify(fs.writeFile);

const poseidon_ = buildPoseidon();

async function getHashes(input) {
    const poseidon = await poseidon_;
    return input.amounts.map((_, i) =>
        poseidon.F.toString(
            poseidon([
                BigInt(input.amounts[i], 10),
                BigInt(input.sValues[i], 16),
            ])
        )
    );
}

async function prepareInput(filename) {
    const file = path.join(__dirname, filename);
    const input = require(file);
    if (input.hashes) return input;
    input.hashes = await getHashes(input);
    await writeFile(file, JSON.stringify(input, null, 4));
    return input;
}

module.exports = {
    prepareInput,
};
