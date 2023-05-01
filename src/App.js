import React, { useEffect, useState } from "react";
import './App.css';
import Contract from "./contracts/Contract";
import web3 from "./web3";


console.log(Contract)
// let accounts;

// beforeEach(async () => {
//     accounts = await web3.eth.getAccounts();
//     Contract = await new web3.eth.Contract(JSON.parse(interface))
//         .deploy({data: bytecode, arguments: [INIT_MESSAGE]})
//         .send({from: accounts[0], gas: '1000000'})
// });

function App() {
  const [proposals, setProposals] = useState([]);
  const [selectedProposal, setSelectedProposal] = useState();
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [votingContract, setVotingContract] = useState();
  const [account, setAccount] = useState();
  const [accounts, setAccounts] = useState([]);
  const [proposalCount, setProposalCount] = useState(0);


  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

  useEffect(() => {
    async function getProposalCount() {
      if (Contract) {
        const accounts = await web3.eth.getAccounts();
        const count = await Contract.methods.proposalCount().call();
        setProposalCount(count);
        setAccount(accounts[0]);
        setAccounts(accounts);
        
        const proposals = [];
        for (let i  =0; i < count; i++) {
          const p = await Contract.methods.proposals(i).call();
          proposals.push(p)
        }
        setProposals(proposals);
      }
    }
    getProposalCount();
  }, []);

  const vote = async (proposalId, vote) => {
    try {
      const accounts = await web3.eth.getAccounts();
      await Contract.methods.vote(proposalId, vote).send({
        from: account,
      })
      setVoteSubmitted(true);
    } catch (err) {
      console.error(err);
    }
  }
  
  async function handleJoin() {
    try {
      const accounts = await web3.eth.getAccounts();
      const r = await Contract.methods.join().send({
        from: account,
      });
      alert("You have joined the voting system!");
    } catch (error) {
      console.error(error);
      alert("Error joining the voting system!");
    }
  }


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const d = new Date(expirationDate);
      d.setDate(d.getDate() + 1)
      const c = await Contract.methods.propose(name, description, Date.parse(d)/1000).send({
        from: account,
        gas: 1500000
      }).on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
        console.log("err", error)
      });
      alert("You have created a proposal!");
    } catch (error) {
      console.error(error);
      alert("Error creating a proposal!");
    }
  };

  const finishProposal = async () => {
    const isApprove = await Contract.methods.finalizeProposal(0).send({
      from: account,
      gas: 1500000
    }).on('error', function(error, receipt) { // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
      console.log("err", error)
    });
    if (isApprove) {
      alert("The proposal is approved")
    } else {
      alert("The proposal is approved")
    }
  }

  const changeAccount = (e) => {
    setAccount(e.target.value)
  }

  return (
    <div className="App">
      <h1>Voting App</h1>
      <div className="container">
        <div>
          <select onChange={changeAccount}>
            {accounts.map(account => {
              return (<option key={account}>{account}</option>)
            })}
          </select>
        </div>
        <div>
          {account && <p>Connected account: {account}</p>}
          <button onClick={handleJoin}>Join the voting system</button>
          <p>Number of proposals: {proposalCount}</p>
        </div>
        <div className="row">
          <div>
            <form onSubmit={handleFormSubmit}>
              <h2>Create a New Proposal</h2>
              <div>
                <label htmlFor="name">Name:</label>
                <input
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="description">Description:</label>
                <textarea
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="expirationDate">Expiration Date:</label>
                <input
                  type="datetime-local"
                  name="expirationDate"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  required
                />
              </div>
              <button type="submit">Create Proposal</button>
            </form>
  
          </div>

          <div className="col-md-8">
            <h2>Proposals</h2>
            {proposals.length > 0 && proposals.map((proposal, i) => {
              return (
                <div className="card" key={i}>
                  <div className="card-body">
                    <h5 className="card-title">{proposal.name}</h5>
                    <p className="card-text">{proposal.description}</p>
                    <p className="card-text"><strong>Ends on:</strong> {new Date(proposal.expirationDate * 1000).toLocaleDateString()}</p>
                    {selectedProposal === proposal.id && (
                      <div>
                        {voteSubmitted ? (
                          <p className="text-success">Vote submitted successfully.</p>
                        ) : (
                          <>
                            <button type="button" className="btn btn-primary" onClick={() => vote(i, true)}>Vote Yes</button>
                            <button type="button" className="btn btn-primary" onClick={() => vote(i, false)}>Vote No</button>

                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div>
        <button onClick={finishProposal}>Finish proposal</button>
      </div>
    </div>
  );
}

export default App;
