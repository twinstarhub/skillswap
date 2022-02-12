import styled from "styled-components";
import { useEffect, useState } from "react";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { ethers } from "ethers";

import { db, storage as storageAlt } from "../firebase";
import {
  collection,
  query,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
  orderBy,
  deleteDoc,
} from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import CountDown from "../component/CountDown";
import { address } from "../assets/address";
import { ThirdwebStorage } from "@thirdweb-dev/storage";

function Order({ setDisplayAlert }) {
  const storage = new ThirdwebStorage();
  const [receiversAdd, setReceiversAdd] = useState([]);
  const [currentAcc, setCurrentAcc] = useState();
  const [orderList, setOrderList] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [sampleFile, setSampleFile] = useState();
  const [originalFile, setOriginalFile] = useState();
  const [percent, setPercent] = useState(0);
  const [allfiles, setAllfiles] = useState([]);
  const [review, setReview] = useState("");
  const [star, setStar] = useState();
  const [sellerAdd, setSellerAdd] = useState("");

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const abi = SkillSwap.abi;

  const contractAddress = address;

  const skillswap = new ethers.Contract(contractAddress, abi, signer);

  useEffect(() => {
    async function loadRecieverAdd() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAcc(account[0].toLowerCase());
      const q = query(
        collection(
          db,
          "chatList",
          account[0].substring(2).toLowerCase(),
          "receivers"
        )
      );
      onSnapshot(q, (querySnapshot) => {
        setReceiversAdd(querySnapshot.docs.map((doc) => doc.data().chatWith));
      });
    }
    loadRecieverAdd();
  }, []);

  async function uploadSample(e, setFile) {
    try {
      const file = e.target.files[0];
      if (file) {
        console.log(file);
        const storageRefSample = ref(storageAlt, `/files/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRefSample, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const percent = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            ); // update progress
            setPercent(percent);
          },
          (err) => console.log(err),
          () => {
            // download url
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
              if (setFile === "sample") {
                setSampleFile(url);
                console.log(url);
              }
              if (setFile === "original") {
                setOriginalFile(url);
                console.log(url);
              }
            });
          }
        );
      }
    } catch (error) {
      alert(error);
      console.log(error);
    }
  }

  async function handleUpload(buyer) {
    if (!sampleFile && !originalFile) {
      alert("Please choose a file first!");
    }
    try {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const col = collection(
        db,
        "fileUrl",
        buyer.toLowerCase(),
        account[0].toLowerCase().substring(2)
      );
      const q = query(col);
      onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.docs.map((doc) => doc.id).length !== 0) {
          console.log(querySnapshot.docs.map((doc) => doc.id).toString());
          async function deleteFile() {
            // const success = await deleteDoc(
            //   doc(
            //     db,
            //     "fileUrl",
            //     buyer.toLowerCase(),
            //     account[0].toLowerCase().substring(2),
            //     querySnapshot.docs.map((doc) => doc.id).toString()
            //   )
            // );
            // console.log(success);
            const r = doc(
              db,
              "fileUrl",
              buyer.toLowerCase(),
              account[0].toLowerCase().substring(2),
              querySnapshot.docs.map((doc) => doc.id)[0].toString()
            );
            await updateDoc(r, {
              sampleUrl: sampleFile,
              originalUrl: originalFile,
            });
            await deleteDoc(r);
          }
          deleteFile();
        } else {
          async function addFile() {
            await addDoc(col, {
              sampleUrl: sampleFile,
              originalUrl: originalFile,
            });
          }
          addFile();
        }
      });
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
          msg: "File sent successfully!",
          isErr: false,
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function loadOrders() {
      try {
        for (let i in receiversAdd) {
          const orderAvailable = await skillswap.deal(
            currentAcc,
            receiversAdd[i]
          );
          const transaction = await skillswap.Transaction(
            currentAcc,
            receiversAdd[i]
          );
          if (
            orderAvailable.seller !=
            "0x0000000000000000000000000000000000000000"
          ) {
            let orderArray = [];
            if (transaction === 1) {
              // let days = parseInt(orderAvailable.duration) / 86400;
              let orderResult = {
                amount: orderAvailable.amount.toString() / 1000000000000000000,
                deadline: orderAvailable.duration.toString(),
                buyer: receiversAdd[i].toLowerCase(),
              };
              orderArray.push(orderResult);
              setOrderList(orderArray);
            }
            if (transaction === 2) {
              // let days = parseInt(orderAvailable.duration) / 86400;
              let orderResult = {
                amount: orderAvailable.amount.toString() / 1000000000000000000,
                deadline: orderAvailable.duration.toString(),
                buyer: receiversAdd[i].toLowerCase(),
                deliveryAccepted: true,
              };
              orderArray.push(orderResult);
              setOrderList(orderArray);
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    loadOrders();
  }, [receiversAdd]);

  async function acceptOrder(seller) {
    try {
      if (review.trim() !== "") {
        const noOfuser = await skillswap.noOfSellers();
        for (let i = 1; i <= noOfuser.toString(); i++) {
          const element = await skillswap.sellerProfile(i);
          if (element.account.toLowerCase() === seller.toLowerCase()) {
            const response = await fetch(
              "https://gateway.ipfscdn.io/ipfs/" + element.uri + "/0"
            );
            const metadata = await response.json();
            console.log(
              "🚀 ~ file: Order.jsx:234 ~ acceptOrder ~ metadata:",
              metadata
            );
            if (metadata.reviews === undefined) {
              const reviewObj = [
                {
                  stars: star,
                  reviewBy: currentAcc,
                  feedback: review,
                },
              ];
              const prevuri = await storage.upload({
                profile: metadata.profile,
                gig: metadata.gig,
                reviews: reviewObj,
              });

              const urlRemoved = prevuri.replace("ipfs://", "");
              const url = urlRemoved.replace("/0", "");
              await skillswap.confirmDelivery(seller, url, i);
              console.log(url);
            } else {
              console.log(metadata.reviews);
              const reviewObj = {
                stars: star,
                reviewBy: currentAcc,
                feedback: review,
              };
              metadata.reviews.push(reviewObj);
              const prevuri = await storage.upload({
                profile: metadata.profile,
                gig: metadata.gig,
                reviews: metadata.reviews,
              });

              const urlRemoved = prevuri.replace("ipfs://", "");
              const url = urlRemoved.replace("/0", "");
              console.log(url);
              await skillswap.confirmDelivery(seller, url, i);
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
                  msg: "Order accepted successfully! All your files will appear on the right side in order page.",
                  isErr: false,
                },
              ]);
            }
          }
        }
      } else {
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
            msg: "Please give reviews to the seller!",
            isErr: true,
          },
        ]);
      }
    } catch (err) {
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
          msg: err.message,
          isErr: true,
        },
      ]);
    }
  }

  useEffect(() => {
    async function showFilesAfterConfirmation() {
      console.log(await skillswap.Transaction(sellerAdd, currentAcc));
      const escrowLv = await skillswap.Transaction(sellerAdd, currentAcc);
      if (escrowLv.toString() === 2) {
        try {
          const col = collection(
            db,
            "fileUrl",
            currentAcc.substring(2),
            sellerAdd.substring(2).toLowerCase()
          );
          const toBuyerCol = collection(
            db,
            "allBuyersFiles",
            "files",
            currentAcc.substring(2)
          );
          const q = query(col);
          onSnapshot(q, (querySnapshot) => {
            async function saveBuyersFiles() {
              await addDoc(toBuyerCol, {
                sampleFile: querySnapshot.docs
                  .map((doc) => doc.data().sampleUrl)
                  .toString(),
                originalFile: querySnapshot.docs
                  .map((doc) => doc.data().originalUrl)
                  .toString(),
                created: Timestamp.now(),
              });
              console.log(querySnapshot.docs.map((doc) => doc.id).toString());
              const success = await deleteDoc(
                doc(
                  db,
                  "fileUrl",
                  currentAcc.substring(2),
                  sellerAdd.substring(2).toLowerCase(),
                  querySnapshot.docs.map((doc) => doc.id).toString()
                )
              );
              console.log(success);
            }
            saveBuyersFiles();
          });
        } catch (err) {
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
              msg: err.message,
              isErr: true,
            },
          ]);
        }
      }
    }
    showFilesAfterConfirmation();
  }, []);

  useEffect(() => {
    async function loadBuyersFiles() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const col = collection(
        db,
        "allBuyersFiles",
        "files",
        account[0].toLowerCase().substring(2)
      );

      const q = query(col, orderBy("created", "desc"));
      onSnapshot(q, (querySnapshot) => {
        let filesArr = [];
        let storedFiles = querySnapshot.docs.map((doc) => doc.data());
        for (let i in storedFiles) {
          filesArr.push(storedFiles[i]);
        }
        setAllfiles(filesArr);
      });
    }
    loadBuyersFiles();
  }, [currentAcc]);

  async function withdrawEth(buyer) {
    try {
      await skillswap.toSeller(buyer);
    } catch (err) {
      console.log(err);
    }
  }

  async function cancelByBuyer(seller) {
    await skillswap.cancelOrder(seller, currentAcc);
  }

  async function cancelBySeller(buyer) {
    await skillswap.cancelOrder(currentAcc, buyer);
  }

  useEffect(() => {
    async function loadDelivery() {
      try {
        let deliveryArray = [];
        for (let i in receiversAdd) {
          const deliveryAvailable = await skillswap.deal(
            receiversAdd[i],
            currentAcc
          );
          if (
            deliveryAvailable.seller !=
            "0x0000000000000000000000000000000000000000"
          ) {
            // let days = parseInt(orderAvailable.duration) / 86400;
            const r = query(
              collection(
                db,
                "fileUrl",
                currentAcc.substring(2),
                receiversAdd[i]
              )
            );
            if (
              (await skillswap.Transaction(
                deliveryAvailable.seller,
                currentAcc
              )) === 1
            ) {
              onSnapshot(r, (querySnapshot) => {
                let deliveryResult = {
                  amount:
                    deliveryAvailable.amount.toString() / 1000000000000000000,
                  deadline: deliveryAvailable.duration.toString(),
                  sampleFileLink: querySnapshot.docs.map(
                    (doc) => doc.data().sampleUrl
                  ),
                  originalFileLink: false,
                  seller: deliveryAvailable.seller,
                  deadlineMet: false,
                };
                setSellerAdd(deliveryAvailable.seller);
                deliveryArray.push(deliveryResult);
                setDeliveryList(deliveryArray);
              });
            }
            if (
              (await skillswap.Transaction(
                deliveryAvailable.seller,
                currentAcc
              )) === 2
            ) {
              onSnapshot(r, (querySnapshot) => {
                let deliveryResult = {
                  amount:
                    deliveryAvailable.amount.toString() / 1000000000000000000,
                  deadline: deliveryAvailable.duration.toString(),
                  sampleFileLink: querySnapshot.docs.map(
                    (doc) => doc.data().sampleUrl
                  ),
                  originalFileLink: querySnapshot.docs.map(
                    (doc) => doc.data().originalUrl
                  ),
                  seller: deliveryAvailable.seller,
                  deadlineMet: false,
                };
                setSellerAdd(deliveryAvailable.seller);
                deliveryArray.push(deliveryResult);
                setDeliveryList(deliveryArray);
              });
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    }
    loadDelivery();
  }, [receiversAdd]);

  async function withdrawByBuyer(seller) {
    try {
      await skillswap.deadlineMet(seller, currentAcc);
    } catch (error) {
      alert(error);
    }
  }

  useEffect(() => {
    async function checkDeadlineMet() {
      if (receiversAdd.length === 0) {
        for (let i in receiversAdd) {
          const dealSellBuy = await skillswap.deal(receiversAdd[i], currentAcc);
          if (dealSellBuy.inProgress) {
            if (Timestamp.now().seconds.toString() !== dealSellBuy.duration) {
              // if (receiversAdd[i] === deliveryList.seller) {
              for (let j in deliveryList) {
                if (
                  "0x" + receiversAdd[i] ==
                  deliveryList[j].seller.toLowerCase()
                ) {
                  deliveryList[j].deadlineMet = true;
                }
              }
            }
          }
        }
      }
    }
    checkDeadlineMet();
  }, [deliveryList]);

  return (
    <Wrapper>
      <Container>
        {orderList.map((orderData, idx) => (
          <OrderSec key={idx}>
            <div>
              <h5>
                <span style={{ fontSize: "16px" }}>
                  Order by: {orderData.buyer}
                </span>{" "}
                <br />
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Soluta
                doloremque illum consequuntur suscipit aliquid! Iure enim ab
                nemo nihil. Numquam voluptate doloribus minima quam, quasi
                temporibus illo. Itaque, recusandae ipsum?
              </h5>
            </div>
            <div>
              <p>
                <span>Time left</span>
              </p>
              <div className="timecolor">
                <CountDown timeStamp={orderData.deadline * 1000} />
              </div>
            </div>
            <div>
              {orderData.deliveryAccepted ? (
                <button onClick={() => withdrawEth(orderData.buyer)}>
                  Withdraw money
                </button>
              ) : (
                <div>
                  <input
                    type="file"
                    placeholder="Sample file"
                    onChange={(e) => uploadSample(e, "sample")}
                  />
                  <input
                    type="file"
                    placeholder="Original work"
                    onChange={(e) => uploadSample(e, "original")}
                  />
                  <button onClick={() => handleUpload(orderData.buyer)}>
                    Upload files
                  </button>
                  <p>{percent}% done</p>
                </div>
              )}
              <button
                className="cancelDanger"
                onClick={() => cancelBySeller(orderData.buyer)}
              >
                Cancel
              </button>
            </div>
            <div>
              <p>
                <span>Amount</span>
              </p>
              <h3>{orderData.amount}ETH</h3>
            </div>
          </OrderSec>
        ))}
        <Content>
          {deliveryList.map((deliveryData, idx) => (
            <Delivery key={idx}>
              <div>
                <h5>
                  <span style={{ fontSize: "16px" }}>
                    Order by: {deliveryData.seller}
                  </span>
                  <br />
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Soluta doloremque illum consequuntur suscipit aliquid! Iure
                  enim ab nemo nihil. Numquam voluptate doloribus minima quam,
                  quasi temporibus illo. Itaque, recusandae ipsum?
                </h5>
              </div>
              <div>
                <p>
                  <span>Time left</span>
                </p>
                <div className="timecolor">
                  <CountDown timeStamp={deliveryData.deadline * 1000} />
                </div>
              </div>
              <div>
                {deliveryData.sampleFileLink.length !== 0 ? (
                  <div>
                    <a
                      href={deliveryData.sampleFileLink}
                      download
                      style={{ color: "lightBlue" }}
                    >
                      Download file
                    </a>
                    {deliveryData.originalFileLink ? (
                      <a
                        href={deliveryData.originalFileLink}
                        download
                        style={{ margin: "0 20px", color: "lightBlue" }}
                      >
                        Download original file
                      </a>
                    ) : (
                      <div></div>
                    )}
                    {!deliveryData.originalFileLink ? (
                      <div>
                        <span>Give feedback to the seller</span>
                        <input
                          type="text"
                          onChange={(e) => setStar(e.target.value)}
                        />
                        <input
                          type="text"
                          onChange={(e) => setReview(e.target.value)}
                        />
                        <button
                          onClick={() => acceptOrder(deliveryData.seller)}
                        >
                          Accept delivery
                        </button>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </div>
                ) : (
                  <p>Files will appear when seller delivers</p>
                )}
                {deliveryData.deadlineMet === true && (
                  <button onClick={() => withdrawByBuyer(deliveryData.seller)}>
                    Withdraw
                  </button>
                )}
                {!deliveryData.originalFileLink ? (
                  <button
                    className="cancelDanger"
                    onClick={() => cancelByBuyer(deliveryData.seller)}
                  >
                    Cancel
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
              <div>
                <p>
                  <span>Amount</span>
                </p>
                <h3>{deliveryData.amount}ETH</h3>
              </div>
            </Delivery>
          ))}
        </Content>

        {allfiles.length !== 0 && (
          <AllFiles>
            <h2>All files</h2>
            {allfiles.map((allfilesData, idx) => (
              <FileSec key={idx}>
                <a href={allfilesData.sampleFile} target="_blank">
                  <div>Sample</div>
                </a>
                <a href={allfilesData.originalFile} target="_blank">
                  <div>Original</div>
                </a>
              </FileSec>
            ))}
          </AllFiles>
        )}
      </Container>
    </Wrapper>
  );
}

export default Order;

const Wrapper = styled.div`
  min-height: 100vh;
  width: 100%;
  padding-top: 90px;
  background: var(--black);
`;

const Container = styled.div`
  width: 97%;
  max-width: 1347px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 70% auto;
  grid-gap: 30px;
  .cancelDanger {
    border: 0;
    background: #b30000;
    color: white;
    padding: 7px 13px;
    cursor: pointer;
  }
  margin-bottom: 80px;
`;

const OrderSec = styled.div`
  padding: 50px 30px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-column: 1/3;
  max-width: 1347px;
  margin: 0 auto;
  grid-gap: 30px;
  align-items: center;
  background: var(--darkBg);
  border-radius: 10px;
  h5 {
    font-size: 24px;
  }
  h3 {
    font-size: 28px;
  }
  span {
    color: var(--darkText);
  }
  .timecolor {
    color: var(--primary);
  }
`;

const Delivery = styled.div`
  padding: 50px 30px;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 30px;
  align-items: center;
  background: var(--darkBg);
  border-radius: 10px;
  h5 {
    font-size: 24px;
  }
  h3 {
    font-size: 28px;
  }
  span {
    color: var(--darkText);
  }
  .timecolor {
    color: var(--primary);
  }
`;

const Content = styled.div``;

const AllFiles = styled.div`
  text-align: center;
  background: var(--darkBg);
  border-radius: 10px;
  padding: 30px 20px;
  grid-column: 2/3;
`;

const FileSec = styled.div`
  margin: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  a {
    color: var(--primary);
  }
  div {
    background: var(--black);
    box-shadow: 1px 1px 3px gray;
    padding: 20px 30px;
    cursor: pointer;
    border-radius: 7px;
    &:hover {
      transition: all 0.5s;
      box-shadow: 0px 0px 1px gray;
      a {
        transition: all 0.5s;
        color: white;
      }
    }
  }
`;
