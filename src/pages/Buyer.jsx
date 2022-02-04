import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../component/Loading";
import { ethers } from "ethers";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { useNavigate } from "react-router-dom";
import { categoryData } from "../assets/category";
import { address } from "../assets/address";

function Buyer({ sellerState }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listGig, setListGig] = useState([]);

  function RenderSeller(e, to) {
    e.preventDefault();
    navigate("/contractor/" + to.slice(2).toLowerCase());
    sellerState(to);
    localStorage.setItem("sellerId", to.toLowerCase());
  }

  useEffect(() => {
    async function loadAllGigs() {
      setLoading(true);

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const abi = SkillSwap.abi;

      const contractAddress = address;

      const skillswap = new ethers.Contract(contractAddress, abi, signer);

      const noOfBuyers = await skillswap.noOfBuyers();
      let gigsArr = [];
      for (let i = 1; i <= noOfBuyers.toString(); i++) {
        const user = await skillswap.buyerProfile(i);
        const response = await fetch(
          "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
        );
        const metadata = await response.json();
        let result = {
          data: metadata.profile,
          address: user.account,
        };
        gigsArr.push(result);
      }
      setListGig(gigsArr);

      setLoading(false);
    }
    loadAllGigs();
  }, []);

  return (
    <Wrapper>
      <Container>
        <Head>All Web3 Companies & Contractors Are Listed here!</Head>
        <Text>
          SkillSwap is fully focused on NFTs. Start your NFT Web3 freelancing
          journey here, or hire someone to help you build the future of your NFT
          Web3 startup.
        </Text>
        {loading ? (
          <Loading />
        ) : (
          <div>
            <GigSection>
              <Box>
                {listGig.map((value, id) => (
                  <Card
                    key={id}
                    onClick={(e) => RenderSeller(e, value.address)}
                  >
                    <PicContainer>
                      <img
                        src={`https://gateway.ipfscdn.io/ipfs/${value.data.image}`}
                        alt={value.data.name}
                      />
                    </PicContainer>
                    <CardText>
                      <h5>{value.data.name}</h5>
                      <h4>{value.data.profileTitle}</h4>
                    </CardText>
                  </Card>
                ))}
              </Box>
            </GigSection>
          </div>
        )}
      </Container>
    </Wrapper>
  );
}

export default Buyer;

const Wrapper = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: start;
`;

const Container = styled.section`
  width: 97%;
  max-width: 1247px;
  margin: 0 auto;
  min-height: 80vh;
  padding-top: 80px;
  @media (max-width: 930px) {
    padding-top: 140px;
  }
`;

const GigSection = styled.section`
  padding: 50px 0;
  h3 {
    font-size: 30px;
  }
`;

const Box = styled.section`
  display: grid;
  grid-template-columns: 33% 33% auto;
  grid-gap: 20px;
  @media (max-width: 930px) {
    grid-template-columns: 50% auto;
  }
  @media (max-width: 590px) {
    grid-template-columns: auto;
  }
`;

const PicContainer = styled.section`
  img {
    width: 98%;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
`;

const Des = styled.p`
  margin-bottom: 20px;
  margin-top: 7px;
  color: var(--darkText);
`;

const Card = styled.section`
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  background: var(--darkBg);
  cursor: pointer;
  border-radius: 8px;
  height: 100%;
  img {
    width: 100%;
  }
  h4 {
    font-size: 20px;
    font-weight: 200;
    margin: 10px 0;
    color: var(--darkText);
  }
  h5 {
    font-size: 15px;
    font-weight: 200;
  }
  p {
    font-size: 16px;
    color: var(--darkText);
  }
  div {
    border-top-right-radius: 8px;
    border-top-left-radius: 8px;
  }
`;

const Head = styled.h1`
  font-size: 40px;
  text-align: center;
`;

const Text = styled.p`
  text-align: center;
  width: 73%;
  margin: 0 auto;
  color: var(--darkText);
  @media (max-width: 930px) {
    width: 97%;
  }
`;

const CardText = styled.div`
  padding: 20px;
`;

const Line = styled.div`
  border-bottom: 1px solid var(--gray);
  margin: 10px 0;
`;
