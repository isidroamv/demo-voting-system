import React, { useEffect, useState } from "react";
import './App.css';
import VotingSystem from './contracts/VotingSystem.json';
import Contract from "./contracts/Contract";
import web3 from "./web3";

// const MyContract = contract(VotingSystem);
// MyContract.setProvider(web3.currentProvider);
// const Contract = MyContract.at('0xCAefDc845Cd5e4d5Ff063B75002027031c296b1F');


// let accounts;

// beforeEach(async () => {
//     accounts = await web3.eth.getAccounts();
//     Contract = await new web3.eth.Contract(JSON.parse(interface))
//         .deploy({data: bytecode, arguments: [INIT_MESSAGE]})
//         .send({from: accounts[0], gas: '1000000'})
// });

function App() {


  async function initializeProvider() {
    let accounts = await web3.eth.getAccounts();
    console.log("Con", await Contract.methods.proposalCount().call())
    //const count = await Contract.methods.proposalCount().call();
    //console.log("count", await Contract.methods.proposalCount().call())
    // const provider = new ethers.providers.Web3Provider(ganache.provider());
    // const signer = provider.getSigner();
    //return new ethers.Contract(AuctionContractAddress, VotingSystemJson, signer);
  }

  async function getProposalCount() {
    if (typeof window.ethereum !== 'undefined') {
      const contract = await initializeProvider();
      // try {
      //   const count = await contract.proposalCount();
      //   console.log(count)
      // } catch (e) {
      //   console.log('error fetching highest bid: ', e);
      // }
    }
  }
 

  async function requestAccount() {
    const account = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(account)
  }

  useEffect(() => {
    requestAccount();
    getProposalCount();
  }, []);

  return (
    <div className="App">
      <h1>Voting App</h1>
    </div>
  );
}

export default App;
