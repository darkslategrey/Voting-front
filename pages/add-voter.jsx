import { useState, useEffect } from "react";
import {
  useToast,
  FormControl,
  FormLabel,
  Button,
  Spinner,
  Input,
} from "@chakra-ui/react";
import { useAccount, useSigner } from "wagmi";
import { ethers } from "ethers";
import Contract from "../contracts/Voting.json";

const AddVoter = () => {
  const [voter, setVoter] = useState("");
  const { data: signer } = useSigner();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const contractAddress = process.env.NEXT_PUBLIC_SCADDRESS;

  const addVoter = async () => {
    try {
      setLoading(true);
      const contract = new ethers.Contract(
        contractAddress,
        Contract.abi,
        signer
      );
      let transaction = await contract.addVoter(voter);
      await transaction.wait();
      setVoter("");
      setLoading(false);
      toast({
        title: "Congratulations!",
        description: "You have added a voter",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setLoading(false);
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
    console.log({ signer });
    setVoter("");
  }, []);
  return (
    <FormControl>
      {loading && <Spinner />}
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
