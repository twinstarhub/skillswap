import React from "react";
import styled from "styled-components";
import { useEffect, useState, useRef } from "react";
import SkillSwap from "../../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { db } from "../../firebase";
import {
  collection,
  doc,
  addDoc,
  setDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "firebase/firestore";
import { ethers } from "ethers";
import { address } from "../../assets/address";

function Chatbox({ sellerChangeState, setDisplayAlert }) {
  const [msgText, setMsgText] = useState("");
  const [displayMsg, setDisplayMsg] = useState([]);
  const [sendTo, setSendTo] = useState("");
  const [receiverAccs, setReceiverAccs] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [offerDeadLine, setOfferDeadLine] = useState("");
  const [offerBudget, setOfferBudget] = useState("");
  const [offerDes, setOfferDes] = useState("");
  const [displayOffer, setDisplayOffer] = useState([]);
  const [openOfferModal, setOpenOfferModal] = useState(false);
  const [currentAcc, setCurrentAcc] = useState();
  const [senderOfferDeleteId, setSenderOfferDeleteId] = useState();
  const [sellersName, setSellersName] = useState();
  const [offerShow, setOfferShow] = useState(false);
  const [isThisSeller, setIsThisSeller] = useState();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const abi = SkillSwap.abi;

  const contractAddress = address;

  const skillswap = new ethers.Contract(contractAddress, abi, signer);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    setSendTo(localStorage.getItem("sellerId")?.toLowerCase());
    setSellersName(localStorage.getItem("sellerName"));
  }, [sellerChangeState]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const DisplayOfferUser = () => {
    if (displayOffer[0].data.createdBy === currentAcc) {
      return <h3>You have made an offer.</h3>;
    }
    if (displayOffer[0].data.createdBy === sendTo) {
      return <h3>Seller has made an offer.</h3>;
    }
    if ((displayOffer.length = 0)) {
      return <p></p>;
    }
  };

  useEffect(() => {
    async function getData() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAcc(account[0]);
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
      });
    }
    getData();
  }, []);

  async function saveSenderAccs() {
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    await addDoc(collection(db, "chatList", sendTo.substring(2), "receivers"), {
      chatWith: account[0].substring(2).toLowerCase(),
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (msgText.trim() !== "") {
      try {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await addDoc(
          collection(
            db,
            "userChat",
            account[0].substring(2).toLowerCase(),
            "receiver",
            sendTo.substring(2),
            "messages"
          ),
          {
            message: msgText,
            created: Timestamp.now(),
            createdBy: account[0],
          }
        );
        await addDoc(
          collection(
            db,
            "userChat",
            sendTo.substring(2),
            "receiver",
            account[0].substring(2).toLowerCase(),
            "messages"
          ),
          {
            message: msgText,
            created: Timestamp.now(),
            createdBy: account[0],
          }
        );

        const r = query(
          collection(db, "chatList", sendTo.substring(2), "receivers")
        );
        onSnapshot(r, (querySnapshot) => {
          if (
            !querySnapshot.docs
              .map((doc) => doc.data().chatWith)
              .includes(account[0].substring(2))
          ) {
            saveSenderAccs();
          }
        });

        setMsgText("");
      } catch (err) {
        alert(err);
      }
    }
  };

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time =
      date + " " + month + " " + year + " " + hour + ":" + min + ":" + sec;
    return time;
  }

  useEffect(() => {
    async function getData() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const isSeller = await skillswap.isSeller(account[0]);
      setIsThisSeller(isSeller);
      if (!sendTo?.substring(2) === "") {
        const q = query(
          collection(
            db,
            "userChat",
            account[0].substring(2).toLowerCase(),
            "receiver",
            sendTo.substring(2),
            "messages"
          ),
          orderBy("created", "desc")
        );
        const r = query(
          collection(
            db,
            "userChat",
            sendTo.substring(2),
            "receiver",
            account[0].substring(2).toLowerCase(),
            "messages"
          ),
          orderBy("created", "desc")
        );
        onSnapshot(r, (querySnapshot) => {
          let isOfferBudget = querySnapshot.docs.map(
            (doc) => doc.data().offerBudget
          );
          let getOfferId = querySnapshot.docs.map((doc) => doc.id);
          for (let i in isOfferBudget) {
            if (isOfferBudget[i] !== undefined) {
              // console.log(getOfferId[i]);
              setSenderOfferDeleteId(getOfferId[i]);
            }
          }
        });
        onSnapshot(q, (querySnapshot) => {
          let dataList = querySnapshot.docs.map((doc) => doc.data().message);
          let dataListOffer = querySnapshot.docs.map(
            (doc) => doc.data().offerBudget
          );
          let dataList2 = querySnapshot.docs.map((doc) => doc);
          let dataArr = [];
          let dataArr2 = [];
          for (let i in dataList) {
            if (dataList[i] !== undefined) {
              dataArr.push({
                id: dataList2[i].id,
                message: dataList2[i].data().message,
                createdAt: timeConverter(dataList2[i].data().created.seconds),
                createdBy:
                  dataList2[i].data().createdBy === account[0] &&
                  "msgByCurrUser",
              });
            }
            if (dataListOffer[i] !== undefined) {
              dataArr2.push({ id: dataList2[i].id, data: dataList2[i].data() });
            }
          }
          setDisplayMsg(dataArr);
          setDisplayOffer(dataArr2);
        });
      }
    }
    getData();
  }, [sendTo]);

  useEffect(() => {
    async function getData() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      if (
        !receiverAccs.includes(sendTo.substring(2)) &&
        account[0].substring(2).toLowerCase() !== sendTo.substring(2)
      ) {
        await addDoc(
          collection(
            db,
            "chatList",
            account[0].substring(2).toLowerCase(),
            "receivers"
          ),
          {
            chatWith: sendTo.substring(2),
          }
        );
      }
    }
    getData();
  }, [receiverAccs]);

  async function makeOffer(e) {
    e.preventDefault();
    if (
      offerBudget.trim() !== "" &&
      offerDeadLine.trim() !== "" &&
      offerDes.trim() !== "" &&
      parseFloat(offerBudget) * 100000 > 1 &&
      offerBudget > 0 &&
      offerDeadLine > 0
    ) {
      try {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        await addDoc(
          collection(
            db,
            "userChat",
            account[0].substring(2).toLowerCase(),
            "receiver",
            sendTo.substring(2),
            "messages"
          ),
          {
            offerBudget: offerBudget,
            offerDeadLine: offerDeadLine,
            offerDes: offerDes,
            created: Timestamp.now(),
            createdBy: account[0],
          }
        );
        await addDoc(
          collection(
            db,
            "userChat",
            sendTo.substring(2),
            "receiver",
            account[0].substring(2).toLowerCase(),
            "messages"
          ),
          {
            offerBudget: offerBudget,
            offerDeadLine: offerDeadLine,
            offerDes: offerDes,
            created: Timestamp.now(),
            createdBy: account[0],
          }
        );
        setModalOpen(false);
      } catch (err) {
        alert(err);
      }
    } else {
      alert("Set all requirements correctly.");
    }
  }

  async function handleDeleteOffer(id) {
    try {
      await deleteDoc(
        doc(
          db,
          "userChat",
          sendTo.substring(2),
          "receiver",
          currentAcc.substring(2).toLowerCase(),
          "messages",
          senderOfferDeleteId
        )
      );
      await deleteDoc(
        doc(
          db,
          "userChat",
          currentAcc.substring(2).toLowerCase(),
          "receiver",
          sendTo.substring(2),
          "messages",
          id
        )
      );
      setDisplayOffer([]);
      setModalOpen(false);
    } catch (err) {
      alert(err);
    }
  }

  async function makeOrder(budget, deadline, id) {
    try {
      const amount = JSON.stringify(budget);
      console.log("🚀 ~ file: Chatbox.jsx:367 ~ makeOrder ~ amount:", amount);

      let deadlineSec = deadline * 86400;
      const EtherToWei = ethers.utils.parseUnits(budget, "ether");
      let totalBudget = parseInt(EtherToWei) + parseInt(EtherToWei) * (1 / 10);
      console.log(
        "🚀 ~ file: Chatbox.jsx:376 ~ makeOrder ~ totalBudget:",
        totalBudget.toString()
      );
      // const ethValue = ethers.utils.formatEther(budget);
      console.log(EtherToWei.toString());
      console.log("working");
      const success = await skillswap.placeOrder(
        sendTo,
        EtherToWei.toString(),
        deadlineSec,
        {
          value: ethers.BigNumber.from(totalBudget.toString()),
        }
      );
      setTimeout(() => {
        setDisplayAlert([
          {
            isNotMsg: true,
          },
        ]);
      }, 5000);
      setDisplayAlert([
        {
          isNotMsg: false,
          msg: "Your order has been successfully started. Please go to the order page to know more.",
          isErr: false,
        },
      ]);
      handleDeleteOffer(id);
    } catch (error) {
      if (error.message.includes(" not a buyer")) {
        setTimeout(() => {
          setDisplayAlert([
            {
              isNotMsg: true,
            },
          ]);
        }, 5000);
        setDisplayAlert([
          {
            isNotMsg: false,
            msg: "Please make an account first in skillswap as a contractor to make a deal!",
            isErr: true,
          },
        ]);
      }
    }
  }

  document.addEventListener("wheel", function () {
    if (
      document.activeElement.type === "number" &&
      document.activeElement.classList.contains("noscroll")
    ) {
      document.activeElement.blur();
    }
  });

  function closeModal() {
    setModalOpen(false);
    setOfferDeadLine();
    setOfferBudget();
    setOfferDes();
  }
  useEffect(() => {
    scrollToBottom();
  }, [displayMsg]);

  return (
    <Wrapper>
      {modalOpen || openOfferModal || offerShow ? (
        <div className="modalBack"></div>
      ) : (
        <div className="openModalAlt"></div>
      )}
      {modalOpen ? (
        <Modal>
          <section className="modalhead">
            <h3>Make offer</h3>
            <div className="closeModal" onClick={closeModal}>
              ×
            </div>
          </section>
          <div>
            <label>Days: </label>
            <input
              type="number"
              className="noscroll"
              onChange={(e) => setOfferDeadLine(e.target.value)}
              value={offerDeadLine}
            ></input>
          </div>
          <div>
            <label>Amount in ETH: </label>
            <input
              type="number"
              onChange={(e) => setOfferBudget(e.target.value)}
              value={offerBudget}
            ></input>
          </div>
          <div>
            <label>Description: </label>
            <textarea
              name="description"
              cols="20"
              rows="10"
              onChange={(e) => setOfferDes(e.target.value)}
              value={offerDes}
            ></textarea>
          </div>
          <button onClick={makeOffer}>Send</button>
        </Modal>
      ) : (
        <div className="openModalAlt"></div>
      )}
      <Main>
        <MainHead>
          <h1>{sellersName}</h1>
          <span>{sendTo}</span>
        </MainHead>
        <Container>
          <MesContent>
            {displayMsg.map((msgData, idx) => (
              <Mes key={idx} className={msgData.createdBy}>
                <ShowMes className={msgData.createdBy + "content"}>
                  <p>{msgData.message}</p>
                </ShowMes>
                <span className={msgData.createdBy + "Date"}>
                  {msgData.createdAt}
                </span>
              </Mes>
            ))}
          </MesContent>
        </Container>
        {displayOffer.length !== 0 && (
          <AboveInput onClick={() => setOfferShow(true)}>
            <DisplayOfferUser />
          </AboveInput>
        )}
        <InputCont
          className={
            displayOffer.length === 0 && isThisSeller ? `` : `toGridCol`
          }
        >
          <input
            type="text"
            placeholder="Type your message..."
            onChange={(e) => setMsgText(e.target.value)}
            value={msgText}
          />
          {displayOffer.length === 0 && isThisSeller && (
            <OfferBox onClick={() => setModalOpen(true)}>Create Offer</OfferBox>
          )}
          <SendBtn onClick={handleSubmit}>
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
                {" "}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M19.2111 2.06722L3.70001 5.94499C1.63843 6.46039 1.38108 9.28612 3.31563 10.1655L8.09467 12.3378C9.07447 12.7831 10.1351 12.944 11.1658 12.8342C11.056 13.8649 11.2168 14.9255 11.6622 15.9053L13.8345 20.6843C14.7139 22.6189 17.5396 22.3615 18.055 20.3L21.9327 4.78886C22.3437 3.14517 20.8548 1.6563 19.2111 2.06722ZM8.92228 10.517C9.85936 10.943 10.9082 10.9755 11.8474 10.6424C12.2024 10.5165 12.5417 10.3383 12.8534 10.1094C12.8968 10.0775 12.9397 10.0446 12.982 10.0108L15.2708 8.17974C15.6351 7.88831 16.1117 8.36491 15.8202 8.7292L13.9892 11.018C13.9553 11.0603 13.9225 11.1032 13.8906 11.1466C13.6617 11.4583 13.4835 11.7976 13.3576 12.1526C13.0244 13.0918 13.057 14.1406 13.4829 15.0777L15.6552 19.8567C15.751 20.0673 16.0586 20.0393 16.1147 19.8149L19.9925 4.30379C20.0372 4.12485 19.8751 3.96277 19.6962 4.00751L4.18509 7.88528C3.96065 7.94138 3.93264 8.249 4.14324 8.34473L8.92228 10.517Z"
                  fill="#ffffff"
                ></path>{" "}
              </g>
            </svg>
          </SendBtn>
          {/* <button onClick={handleSubmit}>Send</button> */}
        </InputCont>
      </Main>
      <Side>
        {displayOffer.length !== 0 && (
          <OfferModal>
            <OfferContent>
              <DisplayOfferUser />
            </OfferContent>
            {displayOffer.map((offerData, idx) => (
              <Offer key={idx}>
                <p>{offerData.data.offerDes}</p>
                <h3>{offerData.data.offerBudget}ETH</h3>
                <h3>{offerData.data.offerDeadLine} Days</h3>
                {displayOffer[0].data.createdBy === currentAcc ? (
                  <button onClick={() => handleDeleteOffer(offerData.id)}>
                    Withdraw Offer
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() =>
                        makeOrder(
                          offerData.data.offerBudget,
                          offerData.data.offerDeadLine,
                          offerData.id
                        )
                      }
                    >
                      Accept offer
                    </button>
                    <button onClick={() => handleDeleteOffer(offerData.id)}>
                      Decline
                    </button>
                  </div>
                )}
              </Offer>
            ))}
          </OfferModal>
        )}
      </Side>
      {displayOffer.length !== 0 && (
        <OfferModal
          className="offermodalOpen"
          style={{ display: `${offerShow ? "block" : "none"}` }}
        >
          {" "}
          <div className="closeModal" onClick={() => setOfferShow(false)}>
            ×
          </div>
          <OfferContent>
            <DisplayOfferUser />
          </OfferContent>
          {displayOffer.map((offerData, idx) => (
            <Offer key={idx}>
              <p>{offerData.data.offerDes}</p>
              <h3>{offerData.data.offerBudget}ETH</h3>
              <h3>{offerData.data.offerDeadLine} Days</h3>
              {displayOffer[0].data.createdBy === currentAcc ? (
                <button onClick={() => handleDeleteOffer(offerData.id)}>
                  Withdraw Offer
                </button>
              ) : (
                <div>
                  <button
                    onClick={() =>
                      makeOrder(
                        offerData.data.offerBudget,
                        offerData.data.offerDeadLine,
                        offerData.id
                      )
                    }
                  >
                    Accept offer
                  </button>
                  <button onClick={() => handleDeleteOffer(offerData.id)}>
                    Decline
                  </button>
                </div>
              )}
            </Offer>
          ))}
        </OfferModal>
      )}
    </Wrapper>
  );
}

export default Chatbox;

const Wrapper = styled.div`
  display: grid;
  width: 98%;
  grid-template-columns: 69% 29%;
  grid-gap: 10px;
  .modalBack {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 128vh;
    width: 100%;
    filter: blur(20px);
    -webkit-filter: blur(20px);
  }
  .openModalAlt {
    display: none;
  }
  @media (max-width: 1158px) {
    grid-template-columns: auto;
  }
  @media (max-width: 730px) {
    width: 96%;
  }
  @media (max-width: 694px) {
    width: 84%;
  }
  @media (max-width: 612px) {
    width: 75%;
  }
  @media (max-width: 549px) {
    width: 65%;
  }
  @media (max-width: 482px) {
    width: 55%;
  }
  @media (max-width: 405px) {
    width: 40%;
  }
  .offermodalOpen {
    display: none;
    position: absolute;
    top: 20%;
    left: 0;
    background: var(--darkBg);
    margin: 0 10px;
    @media (max-width: 1158px) {
      display: block;
    }
    .closeModal {
      width: fit-content;
      cursor: pointer;
      font-size: 28px;
      float: right;
    }
  }
`;

const Container = styled.div`
  border-top: 1px solid var(--line);
  width: 95%;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 70vh;
  padding: 0 10px;
  .openModalAlt {
    display: none;
  }
  ::-webkit-scrollbar {
    width: 5px;
  }
  @media (max-width: 730px) {
    width: 96%;
  }
  @media (max-width: 694px) {
    width: 80%;
  }
  @media (max-width: 612px) {
    width: 70%;
  }
  @media (max-width: 549px) {
    width: 60%;
  }
  @media (max-width: 482px) {
    width: 52%;
  }
  @media (max-width: 405px) {
    width: 38%;
  }
`;

const Main = styled.div`
  .toGridCol {
    grid-template-columns: 90% auto;
  }
  &::-webkit-scrollbar {
    width: 10px;
  }
`;

const InputCont = styled.div`
  display: grid;
  grid-template-columns: 70% auto auto;
  align-self: flex-end;
  width: 97%;
  margin-top: 10px;
  box-shadow: 2px 3px 10px var(--text);
  background: white;
  border-radius: 5px;
  input {
    padding: 20px;
    font-size: 16px;
    border: 0;
    outline: none;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  span {
    background: white;
    text-align: center;
    color: black;
    cursor: pointer;
    padding: 10px;
  }
  @media (max-width: 694px) {
    width: 83%;
  }
  @media (max-width: 612px) {
    width: 73%;
  }
  @media (max-width: 549px) {
    width: 60%;
  }
  @media (max-width: 482px) {
    width: 54%;
  }
  @media (max-width: 405px) {
    width: 36%;
  }
`;

const Mes = styled.div`
  margin: 10px 0;
`;

const MesContent = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: start;
  flex-direction: column-reverse;
  span {
    font-size: 12px;
    color: var(--darkText);
  }
  .msgByCurrUser {
    align-self: flex-end;
  }
  .msgByCurrUsercontent {
    background: var(--primary);
  }
  .msgByCurrUserDate {
    float: right;
  }
`;

const ShowMes = styled.div`
  padding: 10px 20px;
  width: fit-content;
  color: black;
  font-weight: 600;
  font-style: italic;
  border-radius: 20px;
  background-color: white;
`;

const Modal = styled.div`
  position: absolute;
  top: 17%;
  left: 33%;
  z-index: 999;
  background: black;
  display: grid;
  min-height: 40vh;
  padding: 60px;
  border-radius: 10px;
  div {
    display: flex;
    align-items: flex-start;
    flex-direction: column;
    justify-content: start;
    margin: 10px 0;
    width: 100%;
    input {
      padding: 10px;
      font-size: 18px;
      width: 95%;
      border: 0;
      outline: none;
      background: var(--darkBg);
      color: white;
    }

    input[type="number"]::-webkit-inner-spin-button,
    input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      margin: 0;
    }
    textarea {
      min-width: 400px;
      max-width: 450px;
      max-height: 350px;
      padding: 10px;
      font-size: 18px;
      border: 0;
      outline: none;
      background: var(--darkBg);
      color: white;
      font-weight: 100;
      @media (max-width: 700px) {
        min-width: 300px;
        max-width: 320px;
      }
      @media (max-width: 530px) {
        min-width: 200px;
        max-width: 220px;
      }
      @media (max-width: 360px) {
        min-width: 160px;
        max-width: 220px;
      }
    }
    label {
      margin-bottom: 5px;
    }
  }
  button {
    font-size: 18px;
    padding: 7px 20px;
  }
  @media (max-width: 1280px) {
    left: 23%;
  }
  @media (max-width: 866px) {
    left: 16%;
  }
  @media (max-width: 700px) {
    left: 20%;
    padding: 30px;
  }
  @media (max-width: 430px) {
    left: 10%;
  }

  .modalhead {
    display: flex;
    align-items: center;
    justify-content: space-between;
    h3 {
      font-size: 25px;
    }
  }
  .closeModal {
    width: fit-content;
    cursor: pointer;
    font-size: 22px;
  }
`;

const OfferContent = styled.div`
  color: #91b7f4;
  cursor: pointer;
  p {
    font-style: underline;
    border-bottom: 2px solid #91b7f4;
  }
`;

const OfferModal = styled.div`
  min-height: 40vh;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 2px 3px 10px var(--text);
  padding: 30px 10px;

  button {
    padding: 7px 10px;
    cursor: pointer;
    font-size: 18px;
  }
`;

const Offer = styled.div`
  p {
    word-wrap: break-word;
    font-size: 14px;
  }
  p {
    margin: 15px 0;
  }
  h3 {
    border-top: 1px solid var(--line);
    padding: 10px 0;
    margin-bottom: 10px;
  }
`;

const Side = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  max-height: 88vh;
  ::-webkit-scrollbar {
    width: 5px;
  }
  padding: 10px;
  @media (max-width: 1158px) {
    display: none;
  }
`;

const OfferBox = styled.div`
  border: 2px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: center;
  height: fit-content;
  margin: auto 2px;
  padding: 5px;
  border-radius: 4px;
  text-align: center;
  color: black;
  cursor: pointer;
  @media (max-width: 482px) {
    margin: auto 0;
  }
  &:hover {
    transition: all 0.3s;
    background-color: black;
    transition: all 0.3s;
    color: white;
  }
  @media (max-width: 482px) {
    font-size: 12px;
  }
`;

const SendBtn = styled.div`
  background: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
  cursor: pointer;
  svg {
    width: 70%;
    margin: auto;
    @media (max-width: 1158px) {
      width: 40%;
    }
    @media (max-width: 730px) {
      width: 40px;
    }
  }
`;

const MainHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  h1 {
    word-wrap: break-word;
    width: 98%;
  }
  span {
    color: var(--darkText);
    word-wrap: break-word;
    width: 98%;
  }
  padding: 20px;
  @media (max-width: 730px) {
    width: 94%;
  }
  @media (max-width: 694px) {
    width: 80%;
  }
  @media (max-width: 612px) {
    width: 70%;
  }
  @media (max-width: 549px) {
    width: 58%;
  }
  @media (max-width: 482px) {
    width: 48%;
  }
  @media (max-width: 405px) {
    width: 36%;
  }
`;

const AboveInput = styled.div`
  display: none;
  text-align: center;
  h3 {
    color: var(--primary);
    text-decoration: underline;
  }
  @media (max-width: 730px) {
    width: 94%;
  }
  @media (max-width: 694px) {
    width: 80%;
  }
  @media (max-width: 612px) {
    width: 70%;
  }
  @media (max-width: 549px) {
    width: 58%;
  }
  @media (max-width: 482px) {
    width: 48%;
  }
  @media (max-width: 405px) {
    width: 36%;
  }
  @media (max-width: 1158px) {
    display: block;
  }
`;
