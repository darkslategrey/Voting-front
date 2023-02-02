import { useState, useEffect } from "react";
import {
  useToast,
  FormControl,
  FormLabel,
  Button,
  Input,
} from "@chakra-ui/react";
import { useAccount, useProvider, useSigner } from "wagmi";
import { ethers } from "ethers";
import Contract from "../contracts/Voting.json";

const AddVoter = () => {
  const [voter, setVoter] = useState("");
  const { data: signer } = useSigner();
  const provider = useProvider();
  const toast = useToast();
  const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS;

  const addVoter = async () => {
    try {
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.addVoter(voter);
      await transaction.wait();
      setVoter("");
      toast({
        title: "Congratulations!",
        description: "You have added a voter",
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

  useEffect(() => {
    setVoter("");
  }, []);
  return (
    <FormControl>
      <FormLabel>Voter address</FormLabel>
      <Input
        value={voter}
        onChange={(event) => {
          setVoter(event.target.value);
        }}
        type="text"
      />
      <Button onClick={addVoter}>Add</Button>
    </FormControl>
  );
};

export default AddVoter;
