import { Table, Button } from "react-bootstrap";
import { ethers } from 'ethers';

const Proposals = ({ provider, daoContract, listOfProps, quorum, setIsLoading }) => {
  // console.log('>> PROPS TABLE HAS LIST:');
  // console.log(listOfProps);
  // console.table(listOfProps);

  // TODO - ADD verification if current user has voted on prop or not to switch out "Voted" btn

  const handleVote = async(id) => {
    console.log(`>> VOTING ON PROP ${id}...`);
    try {
      const signer = await provider.getSigner();
      const trx = await daoContract.connect(signer).vote(id);
      await trx.wait();
      
      setIsLoading(true);
    } catch(err) {
      console.error('(!) VOTTING FAILED:', err);
      window.alert('(!) User rejected or transaction reverted. (!)');
    }
  };
  
  const handleFinalization = async(id) => {
    console.log(`>> FINALIZING PROP ${id}...`);
    try {
      const signer = await provider.getSigner();
      const trx = await daoContract.connect(signer).finalizeProposal(id);
      await trx.wait();
      
      setIsLoading(true);
    } catch(err) {
      console.error('(!) FINALIZATION FAILED:', err);
      window.alert('(!) User rejected or transaction reverted. (!)');
    }
  };

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>#</th>
          <th>Proposal Name</th>
          <th>Recipient Address</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Total Votes</th>
          <th>Cast Votes</th>
          <th>Finalize</th>
        </tr>
      </thead>
      <tbody>
        {listOfProps.map((prop, i) => {
          const { id, name, recipient, amount, finalized, votes } = prop;
          const readyToFinalize =  !finalized && votes >= quorum;
          return (
            <tr key={i}>
              <td>{id.toString()}</td>
              <td>{name}</td>
              <td>{recipient}</td>
              <td>{ethers.utils.formatUnits(amount, 'ether')} ETH</td>
              <td>{finalized ? 'Approved' : 'In Progress'}</td>
              <td>{votes.toString()}</td>
              <td>
                {finalized ? (
                  'Voted'
                ) : (
                  <Button
                    variant="primary"
                    style={{ width: "100%"}}
                    onClick={() => handleVote(id)}>
                      Vote
                  </Button>
                )}
              </td>
              <td>
                  {readyToFinalize && (
                    <Button
                      variant="primary"
                      style={{ width: "100%"}}
                      onClick={() => {handleFinalization(id)}}>
                        Finalize
                    </Button>
                  )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Proposals;