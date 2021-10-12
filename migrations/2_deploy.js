const BobCoin = artifacts.require("BobCoin");

module.exports = async function (deployer) {
  await deployer.deploy(BobCoin);
};