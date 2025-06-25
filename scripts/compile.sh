#!/usr/bin/env bash

OUT=build/$1; mkdir -p $OUT
circom circuits/$1.circom -l node_modules/circomlib/circuits --output $OUT --r1cs --wasm --sym --inspect --c;
npx snarkjs plonk setup $OUT/$1.r1cs plonk/pot12_final.ptau $OUT/$1.zkey;
npx snarkjs zkey export solidityverifier $OUT/$1.zkey contracts/$2.sol;
npx snarkjs r1cs info $OUT/$1.r1cs;