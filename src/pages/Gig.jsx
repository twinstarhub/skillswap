import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Loading from "../component/Loading";
import { ethers } from "ethers";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { useNavigate } from "react-router-dom";
import { categoryData } from "../assets/category";
import { address } from "../assets/address";

function Gig({ sellerState }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [listCategory, setListCategory] = useState([]);
  const [listGig, setListGig] = useState([]);

  function RenderSeller(e, to) {
    e.preventDefault();
    navigate("/seller/" + to.slice(2).toLowerCase());
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

      const noOfSeller = await skillswap.noOfSellers();
      let categoryArr = [];
      let gigsArr = [];
      for (let i = 1; i <= noOfSeller.toString(); i++) {
        const user = await skillswap.sellerProfile(i);
        const response = await fetch(
          "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
        );
        const metadata = await response.json();
        const categoryWords = metadata.gig.gigCategory;
        categoryArr.push(categoryWords);
        let result = {
          data: metadata.gig,
          address: user.account,
          userName: metadata.profile.name,
        };
        gigsArr.push(result);
      }
      setListCategory(categoryArr);
      setListGig(gigsArr);

      setLoading(false);
    }
    loadAllGigs();
  }, []);

  return (
    <Wrapper>
      <Container>
        <Head>All Web3 Freelancers Are Listed here!</Head>
        <Text>
          SkillSwap is fully focused on NFTs. Start your NFT Web3 freelancing
          journey here, or hire someone to help you build the future of your NFT
          Web3 startup.
        </Text>
        <CategoryRow>
          <ul>
            {listCategory
              .filter((item, index) => listCategory.indexOf(item) === index)
              .map((gig, key) => (
                <a key={key} href={"#" + gig}>
                  <li>{gig}</li>
                </a>
              ))}
          </ul>
        </CategoryRow>
        {loading ? (
          <Loading />
        ) : (
          <div>
            {listCategory
              .filter((item, index) => listCategory.indexOf(item) === index)
              .map((gig, idx) => (
                <GigSection key={idx}>
                  <GigHead>
                    <h3>{gig}</h3>
                    {categoryData.map((c, no) => (
                      <div key={no}>
                        {c.head.toLowerCase() === gig.toLowerCase() && (
                          <Des>{c.text}</Des>
                        )}
                      </div>
                    ))}
                  </GigHead>
                  <Box>
                    {listGig.map(
                      (value, id) =>
                        value.data.gigCategory === gig && (
                          // <CardContainer >
                          <Card
                            id={gig}
                            key={id}
                            onClick={(e) => RenderSeller(e, value.address)}
                          >
                            <div
                              style={{
                                backgroundImage: `url(https://gateway.ipfscdn.io/ipfs/${value.data.gigImg})`,
                                backgroundPosition: "center",
                                backgroundSize: "cover",
                                backgroundRepeat: "no-repeat",
                                width: "100%",
                                height: "30vh",
                              }}
                            ></div>
                            <CardText>
                              <h5>{value.userName}</h5>
                              <h4>{value.data.gigHead}</h4>
                              <Line />
                              <p>
                                Fixed Price
                                <span> ${value.data.fixedPrice}</span>
                              </p>
                            </CardText>
                          </Card>
                          // </CardContainer>
                        )
                    )}
                  </Box>
                </GigSection>
              ))}
          </div>
        )}
      </Container>
    </Wrapper>
  );
}

export default Gig;

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

const GigHead = styled.section``;

const CategoryRow = styled.section`
  margin-top: 20px;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  .toGigList {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
  }
  ul {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
    @media (max-width: 833px) {
      width: 100%;
      min-width: 0;
      align-items: stretch;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      overflow-x: auto;
      overflow-y: hidden;
    }
  }
  li {
    list-style: none;
    font-size: 14px;
    /* padding: 20px; */
    cursor: pointer;
    &:hover {
      /* background: var(--text); */
    }
    @media (max-width: 833px) {
      width: 100%;
      border: 0;
      flex-basis: 33.333%;
      flex-grow: 0;
      flex-shrink: 0;
      white-space: nowrap;
    }
  }

  a {
    color: white;
    padding: 10px;
    font-size: 12px;
    font-weight: 700;
    margin: 10px;
    border: 1px solid white;
    border-radius: 10px;
    background: transparent;
    color: white;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      transition: all 0.3s;
      background-color: white;
      color: black;
    }
  }
`;

const Des = styled.p`
  margin-bottom: 20px;
  margin-top: 7px;
  color: var(--darkText);
`;

const CardContainer = styled.section`
  border: 2px solid red;
  /* display: grid;
  grid-template-columns: 33% 33% auto;
  grid-gap: 20px;
  @media (max-width: 930px) {
    grid-template-columns: 50% auto;
  }
  @media (max-width: 590px) {
    display: flex;
    align-items: center;
    justify-content: start;
    flex-wrap: wrap;
    width: 100%;
    min-width: 0;
    align-items: stretch;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    overflow-x: auto;
    overflow-y: hidden;
  } */
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
  /* @media (max-width: 590px) {
    width: 90%;
    flex-basis: 90%;
    flex-grow: 0;
    flex-shrink: 0;
    height: 100%;
  } */
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
