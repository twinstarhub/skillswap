import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ethers } from "ethers";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { useNavigate } from "react-router-dom";
import Loading from "../component/Loading";
import { address } from "../assets/address";

function Buying({ category, sellerState }) {
  const navigate = useNavigate();
  const [listData, setListData] = useState([]);
  const [listAddr, setListAddr] = useState([]);
  const [loading, setLoading] = useState(false);
  const Category = category.charAt(0).toUpperCase() + category.slice(1);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const abi = SkillSwap.abi;

  const contractAddress = address;

  const skillswap = new ethers.Contract(contractAddress, abi, signer);

  async function loadUser() {
    setLoading(true);
    const noOfuser = await skillswap.noOfSellers();

    for (let index = 1; index <= noOfuser.toString(); index++) {
      const user = await skillswap.sellerProfile(index);
      const response = await fetch(
        "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
      );
      const metadata = await response.json();
      const categoryWords = metadata.gig.gigCategory;
      console.log(
        "🚀 ~ file: Buying.jsx:36 ~ loadUser ~ categoryWords:",
        categoryWords
      );
      console.log(metadata.gig.gigKeywords);
      if (metadata.gig.gigKeywords !== undefined) {
        if (
          categoryWords.toLowerCase().includes(category.toLowerCase()) ||
          metadata.gig.gigKeywords.includes(category.toLowerCase()) ||
          metadata.gig.gigKeywords
            .toString()
            .toLowerCase()
            .replace(",", " ")
            .includes(category.toLowerCase())
        ) {
          if (!listAddr.includes(user.account)) {
            const result = metadata.gig;
            result.userName = metadata.profile.name;
            result.address = user.account;
            setListAddr((prev) => [...prev, user.account]);
            setListData((oldArray) => [...oldArray, result]);
          }
        }
      }
    }
    setLoading(false);
  }

  function RenderSeller(e, to) {
    e.preventDefault();
    navigate("/seller/" + to.slice(2).toLowerCase());
    sellerState(to);
    localStorage.setItem("sellerId", to.toLowerCase());
  }

  useEffect(() => {
    loadUser();
    // eslint - disable - next - line;
  }, []);

  return (
    <Wrapper>
      <Container>
        <h1>{Category}</h1>
        <h3>
          The search query returned all possible matches related to the term "
          {Category}"
        </h3>
        {loading ? (
          <Loading />
        ) : (
          <CardContainer>
            {listData.map((data, idx) => (
              <Card key={idx} onClick={(e) => RenderSeller(e, data.address)}>
                <div
                  style={{
                    backgroundImage: `url(https://gateway.ipfscdn.io/ipfs/${data.gigImg})`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    width: "100%",
                    height: "30vh",
                  }}
                ></div>
                <CardText>
                  <h5>{data.userName}</h5>
                  <h4>{data.gigHead}</h4>
                  <Line />
                  <p>
                    Bear Market Price
                    <span> ${data.gigPrice}</span>
                  </p>
                </CardText>
              </Card>
            ))}
          </CardContainer>
        )}
      </Container>
    </Wrapper>
  );
}

export default Buying;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  color: white;
  padding-top: 72px;
  background: linear-gradient(to right, #111118, #161727, #1a1c35);
  @media (max-width: 930px) {
    padding-top: 60px;
  }
`;

const Container = styled.div`
  padding: 40px 20px;
  max-width: 1147px;
  width: 100%;
  margin: 0 auto;
  h1 {
    font-size: 40px;
    font-weight: 700;
  }
  h3 {
    font-weight: 500;
  }
`;

const CardContainer = styled.div`
  margin-top: 40px;
  display: grid;
  grid-template-columns: 33% 33% auto;
  grid-gap: 20px;
`;
const CardText = styled.div`
  padding: 20px;
`;

const Card = styled.div`
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  background: var(--darkBg);
  cursor: pointer;
  border-radius: 8px;
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

const Line = styled.div`
  border-bottom: 1px solid var(--gray);
  margin: 10px 0;
`;
