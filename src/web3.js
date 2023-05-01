// import Web3 from "web3";
// window.ethereum.request({ method: "eth_requestAccounts" });

// const web3 = new Web3(window.ethereum);
const Web3 = require("web3");
const ganache = require("ganache");
//const web3 = new Web3(ganache.provider());
const web3 = new Web3('ws://localhost:8545');

export default web3;
