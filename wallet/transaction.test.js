const Transaction = require('./transaction');
const Wallet = require('./index');
const { verifySignature } = require('../util');

describe('Transaction', () => {
    let transaction, senderWallet, recipient, amount;

    beforeEach(() => {
        senderWallet = new Wallet();
        recipient = 'recipient-publicKey';
        amount = 50;
        transaction = new Transaction({ senderWallet, recipient, amount });
    });

    it('has an `id`', () => {
        expect(transaction).toHaveProperty('id');
    });

    describe('outputMap', () => {
        it('has `outputMap`', () => {
            expect(transaction).toHaveProperty('outputMap');
        });

        it('outputs the amount to the recipient', () => {
            expect(transaction.outputMap[recipient]).toEqual(amount);
        });

        it('outputs the remaining balance for the `senderWallet`', () => {
            expect(transaction.outputMap[senderWallet.publicKey])
                .toEqual(senderWallet.balance - amount);
        });
    });

    describe('input', () => {
        it('has an `input`', () => {
            expect(transaction).toHaveProperty('input');
        });

        it('has a `timestamp` in the input', () => {
            expect(transaction.input).toHaveProperty('timestamp');
        });

        it('sets the `amount` to the `senderWallet` balance', () => {
            expect(transaction.input.amount).toEqual(senderWallet.balance);
        });

        it('sets the `address` to the `senderWallet` publicKey', () => {
            expect(transaction.input.address).toEqual(senderWallet.publicKey);
        });

        it('signs the input', () => {
            expect(
                verifySignature({
                    publicKey: senderWallet.publicKey,
                    data: transaction.outputMap,
                    signature: transaction.input.signature
                })
            ).toBe(true);
        });
    });

    describe('validTransaction', () => {
        let errorMock;

        beforeEach(() => {
            errorMock = jest.fn();
            global.console.error = errorMock;
        });

   
        describe('when the transaction is invalid', () => {
            it('returns false and logs an error when outputMap is invalid', () => {
                transaction.outputMap[senderWallet.publicKey] = 999999;
                expect(Transaction.validTransaction(transaction)).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });

            it('returns false and logs an error when signature is invalid', () => {
                transaction.input.signature = new Wallet().sign('data');
                expect(Transaction.validTransaction(transaction)).toBe(false);
                expect(errorMock).toHaveBeenCalled();
            });
        });
    });

    describe('update', () =>{
      let originalSignatue, originalSenderOutput, nextRecipient, nextAmount;

      beforeEach(() =>{
        originalSignatue  = transaction.input.signature;
        originalSenderOutput = transaction.outputMap[senderWallet.publicKey];
        nextRecipient = 'next recipient';
        nextAmount = 50;

        transaction.update({
          senderWallet, 
          recipient : nextRecipient, 
          amount : nextAmount
        });
      });

      it('ouputs the amount to the next recipient', () =>{
        expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
      });

      it('substracts the amount from the original sender ouput amount', () =>{
        expect(transaction.outputMap[senderWallet.publicKey])
        .toEqual(originalSenderOutput - nextAmount);
      });

      it('maintains a total output that matches the input amount', () =>{
        expect(
          Object.values(transaction.outputMap)
          .reduce((total,outputAmount) => total + outputAmount)
        ).toEqual(transaction.input.amount)

      });

      it('re-signs the transaction', () =>{
        expect(transaction.input.signature).not.toEqual(originalSignatue);
      });

    });
});
