import { useState, useEffect } from "react";
import {
  Heading,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Switch,
  Textarea,
  Input,
  Button,
  Alert,
  AlertIcon,
  useToast,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import { ethers } from "ethers";
import { useAccount, useProvider, useSigner } from "wagmi";
import Contract from "../contracts/Voting.json";
import styles from "@/styles/Home.module.css";
import useEth from "@/contexts/EthContext/useEth";
import { actions } from "@/contexts/EthContext/state";
const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();
  const { state, dispatch } = useEth();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [switches, setSwitches] = useState({});
  const [winner, setWinner] = useState(null);

  const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS;

  //CHAKRA-UI
  const toast = useToast();

  const handleVotingSession = async (checked) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction;
      let message;
      if (checked) {
        transaction = await contract.startVotingSession();
        message = "Starting voting session";
      } else {
        transaction = await contract.endVotingSession();
        message = "Ending voting session";
      }
      await transaction.wait();
      toast({
        title: "Congratulations!",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: error.reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleProposalsRegistration = async (checked) => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction;
      let message;
      if (checked) {
        transaction = await contract.startProposalsRegistering();
        message = "Starting proposals registering";
      } else {
        transaction = await contract.endProposalsRegistering();
        message = "Ending proposals registering";
      }
      await transaction.wait();
      toast({
        title: "Congratulations!",
        description: message,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: error.reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleShowWinner = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        provider
      );
      let winningProposalID = await contract.winningProposalID();
      let proposal = await contract.getOneProposal(
        winningProposalID.toString()
      );
      proposal = proposal[0];
      console.log("winningproposalID", winningProposalID.toString(), proposal);
      setWinner(winningProposalID.toString() + " " + proposal);
    } catch (error) {
      console.log({ error });
      toast({
        title: "Error",
        description: error.reason,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  const handleCount = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.tallyVotes();
      transaction.wait(2);
    } catch (error) {
      console.log({ error });
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
    const currentState = async () => {
      try {
        const contract = new ethers.Contract(
          contractAddress,
          Contract.abi,
          provider
        );

        const currentState = await contract.workflowStatus();
        console.log({ currentState });
        dispatch({
          type: actions.setCurrentState,
          data: currentState,
        });
      } catch (error) {
        console.log({ error });
        toast({
          title: "Error",
          description: error.reason,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    currentState();
  }, []);

  return (
    <>
      <Flex
        width="100%"
        direction={["column", "column", "row", "row"]}
        alignItems={["center", "center", "flex-start", "flex-start"]}
        flexWrap="wrap"
      >
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="registering-voters" mb="0">
            Registering Voters
          </FormLabel>
          <Switch
            id="registering-voters"
            isChecked={state.workflow.registeringVoters}
            onChange={(e) => {
              dispatch({
                type: actions.registeringVoters,
                data: e.target.checked,
              });
            }}
          />
          <div>{state.workflow.registeringVoters ? "open" : "closed"}</div>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="proposals-registration" mb="0">
            Proposals registration
          </FormLabel>
          <Switch
            id="proposals-registration"
            isChecked={state.currentState === 1}
            onChange={(e) => {
              dispatch({
                type: e.target.checked
                  ? actions.startProposalsRegistration
                  : actions.stopProposalsRegistration,
                data: e.target.checked,
              });
              handleProposalsRegistration(e.target.checked);
            }}
          />
          <div>{state.currentState === 1 ? "open" : "closed"}</div>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="voting-session" mb="0">
            Voting session
          </FormLabel>
          <Switch
            id="voting-session"
            isChecked={state.currentState === 3}
            onChange={(e) => {
              dispatch({
                type: e.target.checked
                  ? actions.startVotingSession
                  : actions.endVotingSession,
                data: e.target.checked,
              });
              handleVotingSession(e.target.checked);
            }}
          />
          <div>{state.currentState === 3 ? "open" : "closed"}</div>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="count-votes" mb="0"></FormLabel>
          <Button onClick={handleCount}>Count vote</Button>
        </FormControl>

        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="count-votes" mb="0"></FormLabel>
          <Button onClick={handleShowWinner}>Show Winner</Button>
        </FormControl>

        {winner !== null ? <h1>Winner is {winner}</h1> : null}
      </Flex>
    </>
  );
}
