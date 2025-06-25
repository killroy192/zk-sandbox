# Deposit Circuit

This repository contains a Circom circuit for validating deposits with cryptographic proofs.

## Circuit Overview

The `Deposit` circuit validates a list of deposit items with the following requirements:

### Public Inputs
- `hashes[maxInputs]`: Poseidon hashes of `{amount, s}` for each item
- `totalAmount`: The total sum of all amounts (uint240)

### Private Inputs
- `amounts[maxInputs]`: Individual amounts (uint240)
- `sValues[maxInputs]`: Secret values (bytes32)

### Validation Rules

1. **Hash Verification**: Each `hash[i]` must equal `poseidon_hash({amount[i], s[i]})`
2. **Amount Sum**: Sum of all `amounts[i]` must equal `totalAmount`
3. **Non-negative Amounts**: All amounts must be non-negative

### Maximum Inputs
The circuit supports up to 3 deposit items (configurable via `maxInputs` parameter).

### Example Usage
```javascript
// Example with 3 deposit items
const inputs = {
    hashes: [hash1, hash2, 0], // Poseidon hashes of {amount, s}
    totalAmount: 1000,
    amounts: [600, 400, 0],
    sValues: [s1, s2, 0]
};
```

## Dependencies

- Circom 2.1.4+
- circomlib (for Poseidon hash and comparators)

## Security Notes

- The circuit uses Poseidon hash for efficient zero-knowledge proof generation
- All amounts are constrained to be uint240 (non-negative)
- Token consistency is enforced by using the public token in hash computation
- The circuit enforces that the sum of private amounts matches the public total
