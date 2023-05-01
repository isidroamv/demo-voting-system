import web3 from "./web3";
import CampaignFactory from "./contracts/VotingSystem.json";

const instance = new web3.eth.Contract(
  CampaignFactory,
  "0xd8b934580fcE35a11B58C6D73aDeE468a2833fa8"
);

export default instance;
