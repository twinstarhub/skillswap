import React, { useState } from "react";
import Chatbox from "../component/chat/Chatbox";
import Sidebar from "../component/chat/Sidebar";
import styled from "styled-components";
// import { db } from "../firebase";
// import {
//   collection,
//   doc,
//   addDoc,
//   setDoc,
//   Timestamp,
//   query,
//   orderBy,
//   onSnapshot,
//   deleteDoc,
// } from "firebase/firestore";
// import { ethers } from "ethers";
// import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";

function Chat({ setDisplayAlert }) {
  const [changeSellerId, setChangeSellerId] = useState("");
  const [sideBarOpen, setSideBarOpen] = useState(false);

  function toggleSidebar() {
    setSideBarOpen(!sideBarOpen);
  }

  return (
    <Wrapper>
      <Container className={sideBarOpen ? "oneGridCol" : "twoGridCol"}>
        <div className={sideBarOpen ? "noSide" : ""}>
          <Sidebar idChange={setChangeSellerId} onClick={toggleSidebar} />
        </div>
        <BarOpen onClick={toggleSidebar}></BarOpen>
        <div className="chatBoxVisible">
          <Chatbox
            sellerChangeState={changeSellerId}
            setDisplayAlert={setDisplayAlert}
          />
        </div>
        <div className={`chattrue ${sideBarOpen ? "" : "nochat"}`}>
          <Chatbox
            sellerChangeState={changeSellerId}
            setDisplayAlert={setDisplayAlert}
          />
        </div>
      </Container>
    </Wrapper>
  );
}

export default Chat;

const Wrapper = styled.div`
  width: 99%;
  color: rgb(255, 255, 255);
  padding-top: 70px;
  background: var(--black);
  overflow-x: hidden;
  @media (max-width: 930px) {
    padding-top: 60px;
  }
  .chatBoxVisible {
    display: block;
    @media (max-width: 1280px) {
      display: none;
    }
  }
  .oneGridCol {
    @media (max-width: 1280px) {
      grid-template-columns: 6% auto;
    }
  }
  .twoGridCol {
    @media (max-width: 1280px) {
      grid-template-columns: 90% auto;
    }
  }
  .chattrue {
    display: none;
    @media (max-width: 1280px) {
      display: block;
    }
  }
  .nochat {
    display: none;
  }
`;

const Container = styled.div`
  background: var(--darkBg);
  width: 95%;
  max-width: 1196px;
  margin: 0 auto;
  min-height: 80vh;
  border-radius: 10px;
  display: grid;
  grid-template-columns: auto 75%;
  grid-gap: 20px;
  margin-bottom: 80px;
  padding: 20px;
  border: 1px solid var(--line);
  @media (max-width: 930px) {
    width: 90%;
  }
  @media (max-width: 730px) {
    width: fit-content;
  }
  .noSide {
    display: block;
    @media (max-width: 1280px) {
      display: none;
    }
  }
  @media (max-width: 649px) {
    grid-gap: 0px;
  }
  /* @media (max-width: 1280px) {
    grid-template-columns: auto 97%;
    padding: 20px 0;
  } */
`;

const NameModal = styled.div`
  position: absolute;
  top: 40%;
  left: 37%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  background: var(--black);
  border-radius: 10px;
  label,
  input,
  button {
    margin: 5px 0;
  }
  input {
    padding: 7px;
    font-size: 20px;
    border: 0;
    outline: none;
    background: var(--darkBg);
    color: white;
  }
  label {
    font-size: 30px;
  }
  button {
    font-size: 18px;
    padding: 7px 40px;
    cursor: pointer;
    background: var(--primary);
    margin-top: 10px;
  }
`;

const BarOpen = styled.div`
  display: none;
  box-shadow: 2px 3px 10px var(--border);
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  width: 15px;
  margin-right: 10px;
  @media (max-width: 1280px) {
    display: block;
  }
`;
