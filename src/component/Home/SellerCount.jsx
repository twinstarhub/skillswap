import React, { useState, useEffect } from "react";
import styled from "styled-components";
import SkillSwap from "../../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { ethers } from "ethers";
import CountUp from "react-countup";
import { address } from "../../assets/address";

function SellerCount() {
  const [contractBalance, setContractBalance] = useState();
  const [noOfSeller, setNoOfSeller] = useState();

  useEffect(() => {
    if (!window.ethereum) {
      setContractBalance("0.42726");
      setNoOfSeller("49642");
    } else {
      async function loadNumbers() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const abi = SkillSwap.abi;

        const contractAddress = address;

        const skillswap = new ethers.Contract(contractAddress, abi, signer);
        const balance = await provider.getBalance(contractAddress);
        setContractBalance(balance.toString() / 1000000000000000000);
        const sellers = await skillswap.noOfSellers();
        for (let i in sellers.toString()) {
        }
        setNoOfSeller(sellers.toString());
      }
      loadNumbers();
    }
  }, []);

  return (
    <Wrapper>
      <Container>
        <div>
          <h3>
            <CountUp start={0} end={noOfSeller} />
          </h3>
          <p>
            <span>Total Freelancer Count</span>
          </p>
        </div>
        <div>
          <h3>{contractBalance}</h3>
          <p>
            <span>ETH In Contract</span>
          </p>
        </div>
      </Container>
    </Wrapper>
  );
}

export default SellerCount;

const Wrapper = styled.div`
  width: 100%;
  background: var(--black);
  padding-top: 70px;
`;

const Container = styled.div`
  width: 90%;
  max-width: 1147px;
  margin: 0 auto;
  /* border: 2px solid red; */
  padding: 50px 20px;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border-top: 1px solid var(--gray);
  border-bottom: 1px solid var(--gray);
  @media (max-width: 730px) {
    flex-direction: column-reverse;
    width: 80%;
  }
  div {
    text-align: center;
    @media (max-width: 730px) {
      margin: 20px 0;
    }
  }
  h3 {
    font-size: 40px;
  }
`;
