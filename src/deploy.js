// deploy code will go here
const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile').default

const provider = new HDWalletProvider(
    'tooth rescue frown bicycle road during cup story spoil engage obey area',
    'https://sepolia.infura.io/v3/8f07d41d2ba049e0be40d2fd3dee0e06'
);

const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log('attemting to deploy from account', accounts[0]);
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi there']})
        .send({gas: '1000000', from: accounts[0]})

    console.log('Contract to deploy', result.options.address)

    provider.engine.stop();
}

deploy();