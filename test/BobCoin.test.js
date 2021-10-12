// Import utilities from Test Helpers
const { BN, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');

const BobCoin = artifacts.require('BobCoin');

contract('BobCoin', function () {
  it('Should return the coin name BobCoin', async function () {
    const bobCoin = await BobCoin.deployed();
    const result = await bobCoin.name();
    assert(result === 'BobCoin');
  });

  it('Should return the coin symbol BC', async function () {
    const bobCoin = await BobCoin.deployed();
    const result = await bobCoin.symbol();
    assert(result === 'BC');
  });

  it('Should return the coin decimals', async function () {
    const bobCoin = await BobCoin.deployed();
    const result = await bobCoin.decimals();
    assert(result.toString() == '18');
  });

});