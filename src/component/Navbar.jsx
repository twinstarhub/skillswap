import React, { useState, useEffect } from "react";
import styled from "styled-components";
import search from "../images/search.svg";
import chat from "../images/chat.svg";
import { Link, useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import logo from "../images/logo.png";
import smallLogo from "../images/Skill_Swap_5.png";
import { address } from "../assets/address";

function Navbar({ searchState }) {
  const navigate = useNavigate();
  const [connectBtn, setConnectBtn] = useState("Connect");
  const [searchResult, setSearchResult] = useState("");
  const [hiredText, setHiredText] = useState("Create Account");

  function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }

  function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  useEffect(() => {
    async function getHiredTextLoad() {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const abi = SkillSwap.abi;

        const contractAddress = address;

        const skillswap = new ethers.Contract(contractAddress, abi, signer);
        const noOfseller = await skillswap.noOfSellers();
        const noOfbuyer = await skillswap.noOfBuyers();

        const isSeller = await skillswap.isSeller(account[0]);
        const isBuyer = await skillswap.isBuyer(account[0]);
        if (!isSeller || !isBuyer) {
          setConnectBtn("Connected");
        }
        if (isSeller) {
          setHiredText("My profile");
          for (let index = 1; index <= noOfseller.toString(); index++) {
            const user = await skillswap.sellerProfile(index);
            if (user.account.toLowerCase() === account[0]) {
              setConnectBtn(
                account[0].substring(0, 4) + "..." + account[0].slice(-3)
              );
            }
          }
        }
        if (isBuyer) {
          setHiredText("My profile");
          for (let index = 1; index <= noOfbuyer.toString(); index++) {
            const user = await skillswap.buyerProfile(index);
            if (user.account.toLowerCase() === account[0]) {
              setConnectBtn(
                account[0].substring(0, 4) + "..." + account[0].slice(-3)
              );
            }
          }
        }
      }
    }
    getHiredTextLoad();
  }, []);
  async function connectWallet() {
    // const provider = new ethers.providers.Web3Provider(window.ethereum, 'goerli');
    // await window.ethereum.enable();
    if (window.ethereum) {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    } else {
      alert("please install metamask wallet");
    }
  }

  async function goToSell() {
    if (!window.ethereum) {
      alert("Please download metamask wallet to continue.");
    } else {
      navigate("/myprofile", { replace: true });
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (!window.ethereum) {
        alert("Please download metamask wallet to continue.");
      } else {
        navigate(searchResult.trim());
        searchState(searchResult.trim());
        localStorage.setItem("searchReq", searchResult.trim());
      }
    }
  };

  const handleGoToChat = () => {
    if (!window.ethereum) {
      alert("Please download metamask wallet to continue.");
    } else {
      navigate("/chat/");
    }
  };

  const handleGoToOrder = () => {
    if (!window.ethereum) {
      alert("Please download metamask wallet to continue.");
    } else {
      navigate("/order/");
    }
  };

  return (
    <Wrapper>
      <Container>
        <Logo>
          <Link to="/" style={{ textDecoration: "none" }}>
            <BigLogo src={logo} alt="" />
            <SmallLogo src={smallLogo} alt="" />
          </Link>
        </Logo>
        <Search>
          <img src={search} alt="search on skillswap - skill swap" />
          <input
            type="text"
            placeholder="Search for the services"
            onChange={(e) => setSearchResult(e.target.value)}
            value={searchResult}
            onKeyDown={handleKeyDown}
          />
        </Search>
        <Right>
          <svg
            width="32px"
            height="32px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleGoToOrder}
            style={{ cursor: "pointer" }}
          >
            <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
            <g
              id="SVGRepo_tracerCarrier"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></g>
            <g id="SVGRepo_iconCarrier">
              {" "}
              <path
                d="M4.78571 5H18.2251C19.5903 5 20.5542 6.33739 20.1225 7.63246L18.4558 12.6325C18.1836 13.4491 17.4193 14 16.5585 14H6.07142M4.78571 5L4.74531 4.71716C4.60455 3.73186 3.76071 3 2.76541 3H2M4.78571 5L6.07142 14M6.07142 14L6.25469 15.2828C6.39545 16.2681 7.23929 17 8.23459 17H17M17 17C15.8954 17 15 17.8954 15 19C15 20.1046 15.8954 21 17 21C18.1046 21 19 20.1046 19 19C19 17.8954 18.1046 17 17 17ZM11 19C11 20.1046 10.1046 21 9 21C7.89543 21 7 20.1046 7 19C7 17.8954 7.89543 17 9 17C10.1046 17 11 17.8954 11 19Z"
                stroke="#ffffff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>{" "}
            </g>
          </svg>
          <img
            src={chat}
            onClick={handleGoToChat}
            alt="chat on skillswap - skill swap"
          />
          <h4
            onClick={goToSell}
            style={{ cursor: "pointer", textDecoration: "underline" }}
          >
            {hiredText}
          </h4>
          <button onClick={connectWallet}>{connectBtn}</button>
        </Right>
        <Collapse className="collapse">
          <div id="mySidebar" className="sidebar">
            <a
              // href="javascript:void(0)"
              className="closebtn"
              onClick={closeNav}
            >
              ×
            </a>
            <button className="connect" onClick={connectWallet}>
              {connectBtn}
            </button>
            <Link to="/">Home</Link>
            <Link to="/myprofile">{hiredText}</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/order">Orders</Link>
          </div>

          <div id="main">
            <button className="openbtn" onClick={openNav}>
              ☰
            </button>
          </div>
        </Collapse>
      </Container>
    </Wrapper>
  );
}

export default Navbar;

const Wrapper = styled.section`
  padding: 10px;
  background: transparent;
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 9999;
`;

const Container = styled.section`
  display: grid;
  grid-template-columns: 30% 40% auto;
  padding: 0 40px;
  @media (max-width: 1080px) {
    button {
      outline: none;
    }
  }
  @media (max-width: 1368px) {
    grid-template-columns: 20% 45% auto;
  }
  @media (max-width: 1210px) {
    grid-template-columns: 20% 40% auto;
  }
  @media (max-width: 1045px) {
    grid-template-columns: 20% 35% auto;
  }
  @media (max-width: 998px) {
    grid-template-columns: 10% 45% auto;
  }
  @media (max-width: 930px) {
    grid-template-columns: 25% 60% auto;
    grid-gap: 10px;
    padding: 0;
    padding-right: 10px;
  }
  @media (max-width: 500px) {
    grid-template-columns: 18% 60% auto;
  }
`;

const Right = styled.section`
  img {
    width: 30px;
    margin: 0 10px;
    cursor: pointer;
  }
  a {
    color: white;
    margin: 0 10px;
    &:hover {
      color: var(--primary);
    }
  }
  button {
    margin: 0 10px;
    padding: 6px 20px;
    background: var(--primary);
    font-size: 20px;
    border: 0;
    border-radius: 6px;
    outline: none;
    cursor: pointer;
    color: white;
    border: 2px solid var(--primary);

    &:hover {
      transition: all 0.3s;
      background: transparent;
    }
    @media (max-width: 600px) {
      display: none;
    }
  }

  display: flex;
  align-items: center;
  justify-content: end;
  padding: 0 10px;
  outline: none;
  border: 0;

  @media (max-width: 930px) {
    display: none;
  }
`;

const Search = styled.section`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  background: rgba(123, 123, 123, 0.167);
  backdrop-filter: blur(60px);
  border: 0.6px solid var(--gray);
  border-radius: 10px;
  @media (max-width: 930px) {
    margin-top: 6px;
    background: transparent;
    backdrop-filter: blur(10px);
  }
  img {
    width: 25px;
    color: white;
  }
  input {
    font-size: 20px;
    background: transparent;
    outline: none;
    border: 0;
    width: 100%;
    color: white;
    padding: 2px 4px;
  }
`;

const Logo = styled.section`
  width: 170px;
  display: flex;
  align-items: center;
  justify-content: center;
  Link {
    text-decoration: none;
  }
  h2 {
    color: white;
  }
  @media (max-width: 996px) {
    justify-content: flex-start;
  }
`;

const Collapse = styled.section`
  display: none;
  .sidebar {
    height: 100vh;
    width: 0;
    position: fixed;
    z-index: 999;
    top: 0;
    right: 0;
    background-color: var(--darkBg);
    overflow-x: hidden;
    transition: 0.5s;
    padding-top: 60px;
  }

  .sidebar a {
    padding: 8px 8px 8px 32px;
    text-decoration: none;
    font-size: 25px;
    color: #ffffff;
    display: block;
    transition: 0.3s;
    display: flex;
    align-items: center;
  }

  .sidebar a:hover {
    color: #f1f1f1;
  }

  .sidebar .closebtn {
    position: absolute;
    top: 0;
    right: 25px;
    font-size: 36px;
    margin-left: 50px;
    cursor: pointer;
  }

  .openbtn {
    font-size: 25px;
    cursor: pointer;
    background-color: #ffffff00;
    color: rgb(255, 255, 255);
    padding: 10px 15px;
    border: none;
  }

  .openbtn:hover {
    background-color: #02020246;
  }

  #main {
    transition: margin-left 0.5s;
    float: right;
  }
  .connect {
    margin: 10px 30px;
    padding: 6px 20px;
    background: var(--primary);
    font-size: 20px;
    border-radius: 20px;
    border: 0;
    cursor: pointer;
    &:hover {
      transition: all 0.3s;
      background: var(--primaryLight);
      color: var(--text);
    }
  }

  @media (max-width: 930px) {
    display: block;
  }
`;

const SmallLogo = styled.img`
  display: none;
  width: 80px;
  @media (max-width: 996px) {
    display: block;
  }
`;

const BigLogo = styled.img`
  width: 100%;
  @media (max-width: 996px) {
    display: none;
  }
`;
