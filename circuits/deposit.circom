pragma circom 2.1.4;

include "poseidon.circom";
include "comparators.circom";

template Deposit(maxInputs) {
    // Public inputs
    signal input hashes[maxInputs]; // poseidon hashes of {amount, s}
    signal input totalAmount; // uint240 total amount
    
    // Private inputs
    signal input amounts[maxInputs]; // uint240 amounts
    signal input sValues[maxInputs]; // bytes32 s values
    
    // Outputs
    signal output valid;
    
    // Component for poseidon hash
    component hashers[maxInputs];
    component amountCheck[maxInputs];
    component totalSum;
    
    // Validate each input
    for (var i = 0; i < maxInputs; i++) {
        // 1. Validate hash[i] = poseidon_hash({amount[i], s[i]})
        hashers[i] = Poseidon(2);
        hashers[i].inputs[0] <== amounts[i];
        hashers[i].inputs[1] <== sValues[i];
        
        hashes[i] === hashers[i].out;
        
        // 2. Validate amount[i] >= 0
        amountCheck[i] = GreaterEqThan(240);
        amountCheck[i].in[0] <== amounts[i];
        amountCheck[i].in[1] <== 0;
        amountCheck[i].out === 1;
    }
    
    // 3. Validate sum of amounts = totalAmount
    totalSum = Sum(maxInputs);
    for (var i = 0; i < maxInputs; i++) {
        totalSum.in[i] <== amounts[i];
    }
    totalSum.out === totalAmount;
    
    // Set output to valid (1) if all checks pass
    valid <== 1;
}

// Helper template for summing multiple values
template Sum(n) {
    signal input in[n];
    signal output out;
    
    var sum = 0;
    for (var i = 0; i < n; i++) {
        sum += in[i];
    }
    out <== sum;
}
