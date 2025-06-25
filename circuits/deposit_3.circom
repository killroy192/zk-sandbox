pragma circom 2.1.4;

include "deposit.circom";

component main {public [hashes, totalAmount]} = Deposit(3);
