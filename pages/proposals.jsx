import { useState, useEffect } from "react";

import {
  useToast,
  Flex,
  Box,
  FormControl,
  FormLabel,
  Spinner,
  OrderedList,
  ListItem,
  Input,
  Button,
} from "@chakra-ui/react";
import { useAccount, useProvider, useSigner } from "wagmi";
import Contract from "../contracts/Voting.json";
import { ethers } from "ethers";

const Proposals = () => {
  const [proposals, setProposals] = useState([]);
  const [proposal, setProposal] = useState();
  const [loading, setLoading] = useState(false);
  const { data: signer } = useSigner();
  const provider = useProvider();
  const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS;
  const toast = useToast();

  const handleVote = async (idx) => {
    console.log({ idx });
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.setVote(idx);
      transaction.wait();

      setLoading(false);
      toast({
        title: "Congratulations!",
        description: "You voted",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const addProposal = async () => {
    if (proposal.length === 0) return;
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.addProposal(proposal);
      transaction.wait();
      console.log({ proposal });
      setProposals((older) => [...older, new Array(proposal)]);

      setLoading(false);
      toast({
        title: "Congratulations!",
        description: "Proposal added",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    const getProposals = async () => {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          Contract.abi,
          signer
        );
        const list = await contract.getProposals();
        console.log({ list });
        setProposals(list);
      } catch (error) {
        toast({
          title: "Error",
          description: error.reason,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    getProposals();
  }, []);

  return (
    <Box>
      {loading && <Spinner />}
      <OrderedList>
        {proposals.map((e, key) => {
          return (
            <div key={key}>
              <ListItem>{e[0]}</ListItem>
              <Button
                onClick={() => {
                  handleVote(key);
                }}
              >
                Vote
              </Button>
            </div>
          );
        })}
      </OrderedList>
      <FormControl>
        <FormLabel>Proposal</FormLabel>
        <Input
          onChange={(event) => {
            setProposal(event.target.value);
          }}
          type="text"
        />
        <Button onClick={addProposal}>Add</Button>
      </FormControl>
    </Box>
  );
};

export default Proposals;
