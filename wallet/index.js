const {STARTING_BALLANCE} = require('../config');
const {ec} = require('../util');
const cryptoHash = require('../util/crypto-hash')


class Wallet {
    constructor(){
        this.balance = STARTING_BALLANCE;

        this.keyPair = ec.genKeyPair();

        this.publicKey = this.keyPair.getPublic().encode('hex');
    }

    sign(data){
        return this.keyPair.sign(cryptoHash(data));

    }
}

module.exports = Wallet;