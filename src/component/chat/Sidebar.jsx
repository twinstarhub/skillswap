import React from "react";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { collection, query, doc, onSnapshot, getDoc } from "firebase/firestore";
import SkillSwap from "../../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { ethers } from "ethers";
import Loading from "../Loading";
import { address } from "../../assets/address";

function Sidebar({ idChange }) {
  const [loading, setLoading] = useState(false);
  const [receiverAccs, setReceiverAccs] = useState([]);
  const [msgAccs, setMsgAccs] = useState([]);

  async function goToChat(to, name) {
    localStorage.setItem("sellerId", "0x" + to);
    localStorage.setItem("sellerName", name);
    idChange("0x" + to);
  }

  useEffect(() => {
    try {
      async function getData() {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const abi = SkillSwap.abi;

        const contractAddress = address;

        const skillswap = new ethers.Contract(contractAddress, abi, signer);

        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const q = query(
          collection(
            db,
            "chatList",
            account[0].substring(2).toLowerCase(),
            "receivers"
          )
        );
        onSnapshot(q, (querySnapshot) => {
          setReceiverAccs(querySnapshot.docs.map((doc) => doc.data().chatWith));
          async function loadChatProfile() {
            setLoading(true);
            let listOfSellers = querySnapshot.docs.map(
              (doc) => doc.data().chatWith
            );
            let chatProfile = [];
            for (let i in listOfSellers) {
              const isSeller = await skillswap.isSeller(listOfSellers[i]);
              const isBuyer = await skillswap.isBuyer(listOfSellers[i]);
              if (isSeller) {
                const noOfSeller = await skillswap.noOfSellers();

                for (let j = 1; j <= noOfSeller.toString(); j++) {
                  const user = await skillswap.sellerProfile(j);
                  if (user.account.toLowerCase() === "0x" + listOfSellers[i]) {
                    const response = await fetch(
                      "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
                    );
                    const metadata = await response.json();
                    let sellerObj = {
                      name: metadata.profile.name,
                      img:
                        metadata.profile.image === undefined
                          ? "img"
                          : metadata.profile.image,
                      address: listOfSellers[i],
                    };
                    chatProfile.push(sellerObj);
                  }
                }
              }
              if (isBuyer) {
                const noOfBuyer = await skillswap.noOfBuyers();
                for (let j = 1; j <= noOfBuyer.toString(); j++) {
                  const user = await skillswap.buyerProfile(j);
                  if (user.account.toLowerCase() === "0x" + listOfSellers[i]) {
                    const response = await fetch(
                      "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
                    );
                    const metadata = await response.json();
                    let sellerObj = {
                      name: metadata.profile.name,
                      img:
                        metadata.profile.image === undefined
                          ? "img"
                          : metadata.profile.image,
                      address: listOfSellers[i],
                    };
                    chatProfile.push(sellerObj);
                  }
                }
              }
              if (!isSeller && !isBuyer) {
                let sellerObj = {
                  name: listOfSellers[i],
                  img: "img",
                  address: listOfSellers[i],
                };
                chatProfile.push(sellerObj);
              }
            }
            setMsgAccs(chatProfile);
            setLoading(false);
          }
          loadChatProfile();
        });
      }

      getData();
    } catch (err) {
      alert(err);
    }
  }, []);

  return (
    <Wrapper>
      <h3>Chat</h3>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {msgAccs &&
            msgAccs.map((data, idx) => (
              <User key={idx} onClick={() => goToChat(data.address, data.name)}>
                <Profile>
                  <Img>
                    {data.img === "img" ? (
                      <svg
                        width="64px"
                        height="64px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                        <g
                          id="SVGRepo_tracerCarrier"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        ></g>
                        <g id="SVGRepo_iconCarrier">
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M16.5 7.063C16.5 10.258 14.57 13 12 13c-2.572 0-4.5-2.742-4.5-5.938C7.5 3.868 9.16 2 12 2s4.5 1.867 4.5 5.063zM4.102 20.142C4.487 20.6 6.145 22 12 22c5.855 0 7.512-1.4 7.898-1.857a.416.416 0 0 0 .09-.317C19.9 18.944 19.106 15 12 15s-7.9 3.944-7.989 4.826a.416.416 0 0 0 .091.317z"
                            fill="rgba(255, 255, 255, 0.551)"
                          ></path>
                        </g>
                      </svg>
                    ) : (
                      <ProfilePic
                        src={`https://gateway.ipfscdn.io/ipfs/${data.img}`}
                      />
                    )}
                  </Img>
                  <div>
                    <h4>{data.name}</h4>
                    <p>{data.address}</p>
                  </div>
                </Profile>
              </User>
            ))}
        </div>
      )}
    </Wrapper>
  );
}

export default Sidebar;

const Wrapper = styled.div`
  border-radius: 5px;
  box-shadow: 2px 3px 10px var(--text);
  overflow-y: scroll;
  overflow-x: hidden;
  height: 88vh;
  width: 98%;
  ::-webkit-scrollbar {
    width: 5px;
  }
  h3 {
    font-size: 28px;
    padding-top: 20px;
    padding-left: 10px;
    text-align: center;
  }
  @media (max-width: 1280px) {
    /* display: none; */
  }
`;

const Profile = styled.div`
  width: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: start;
  padding: 20px 12px;
  svg {
    width: 100%;
  }
  img {
    width: 100%;
  }
  h4 {
    padding: 0;
    width: 200px;
    word-wrap: break-word;
    margin-left: 10px;
  }
  p {
    color: var(--darkText);
    font-size: 13px;
    font-weight: 100;
    width: 220px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-left: 10px;
  }
`;

const User = styled.div`
  border-bottom: 1px solid var(--line);
  cursor: pointer;
`;

const Img = styled.div`
  width: 40px;
`;

const ProfilePic = styled.img`
  width: 100%;
  padding: 5px;
  border-radius: 50%;
`;
