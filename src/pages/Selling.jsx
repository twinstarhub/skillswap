import styled from "styled-components";
import React, { useEffect, useState, useRef } from "react";
import { countriesData } from "../assets/countries";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import axios from "axios";
import { ethers } from "ethers";
import SkillSwap from "../artifacts/contracts/SkillSwap.sol/SkillSwap.json";
import { TagsInput } from "react-tag-input-component";
import Loading from "../component/Loading";
import { useNavigate } from "react-router-dom";
import { address } from "../assets/address";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Rating from "@mui/material/Rating";

function Selling({ setDisplayAlert }) {
  const storage = new ThirdwebStorage();
  const [name, setName] = useState();
  const [profileTitle, setProfileTitle] = useState();
  const [country, setCountry] = useState();
  const [description, setDescription] = useState();
  const [urlS, setUrl] = useState();
  const [twitterLink, setTwitterLink] = useState();
  const [emailAdd, setEmailAdd] = useState();
  const [phoneNo, setPhoneNo] = useState();
  const [skill, setSkill] = useState();
  const [lang, setLang] = useState();
  const [education, setEducation] = useState();
  const [img, setImg] = useState();
  const [gigImg, setGigImg] = useState();
  const [gigHead, setGigHead] = useState();
  const [gigDescrip, setGigDescrip] = useState();
  const [gigCategory, setGigCategory] = useState();
  const [gigKeywords, setGigKeywords] = useState();
  const [gigPrice, setGigPrice] = useState();
  const [weeklyPrice, setWeeklyPrice] = useState();
  const [monthlyPrice, setMonthlyPrice] = useState();
  const [fixedPrice, setFixedPrice] = useState();
  const [isPriceFree, setIsPriceFree] = useState();
  const [gigBullPrice, setGigBullPrice] = useState();
  const [firstPage, setFirstPage] = useState(true);
  const [displayProfile, setDisplayProfile] = useState([]);
  const [displayGig, setDisplayGig] = useState([]);
  const [userLogin, setUserLogin] = useState(true);
  const [gigFormItem, setGigFormItem] = useState([]);
  const [profileFormItem, setProfileFormItem] = useState([]);
  const [editButton, setEditButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentAcc, setCurrentAcc] = useState();
  const [selectUser, setSelectUser] = useState("");
  const [isUserSelected, setIsUserSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [displayBuyer, setDisplayBuyer] = useState([]);
  const [portfolioImgs, setPortfolioImgs] = useState([]);
  const [portImgOpen, setPortImgOpen] = useState(false);
  const [portImgBig, setPortImgBig] = useState();
  const [reviewItems, setReviewItems] = useState();
  const [showAvgStar, setShowAvgStar] = useState(0);
  const navigate = useNavigate();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const abi = SkillSwap.abi;

  const contractAddress = address;

  const skillswap = new ethers.Contract(contractAddress, abi, signer);

  useEffect(() => {
    localStorage.setItem("gigFormItem", JSON.stringify(gigFormItem));
  }, [gigFormItem]);

  useEffect(() => {
    localStorage.setItem("profileFormItem", JSON.stringify(profileFormItem));
  }, [profileFormItem]);

  document.addEventListener("wheel", function () {
    if (
      document.activeElement.type === "number" &&
      document.activeElement.classList.contains("noscroll")
    ) {
      document.activeElement.blur();
    }
  });

  function handleEditProfile() {
    setUserLogin(false);
    setEditButton(true);
    setName(profileFormItem[0].name);
    setProfileTitle(profileFormItem[0].profileTitle);
    setImg(profileFormItem[0].image);
    setCountry(profileFormItem[0].country);
    setDescription(profileFormItem[0].description);
    setUrl(profileFormItem[0].urlS);
    setTwitterLink(profileFormItem[0].twitterLink);
    setEmailAdd(profileFormItem[0].emailAdd);
    setPhoneNo(profileFormItem[0].phoneNo);
    setSkill(profileFormItem[0].skill);
    setLang(profileFormItem[0].language);
    setEducation(profileFormItem[0].education);
    setGigImg(gigFormItem[0].gigImg);
    setPortfolioImgs(gigFormItem[0].portfolioImgs);
    setGigHead(gigFormItem[0].gigHead);
    setGigDescrip(gigFormItem[0].gigDescription);
    setGigKeywords(gigFormItem[0].gigKeywords);
    setGigPrice(gigFormItem[0].gigPrice);
    setWeeklyPrice(gigFormItem[0].weeklyPrice);
    setMonthlyPrice(gigFormItem[0].monthlyPrice);
    setFixedPrice(gigFormItem[0].fixedPrice);
    setIsPriceFree(gigFormItem[0].isPriceFree);
    setGigBullPrice(gigFormItem[0].gigBullPrice);
    setGigCategory(gigFormItem[0].gigCategory);
  }

  function handleBuyerEditProfile() {
    setUserLogin(false);
    setEditButton(true);
    setName(profileFormItem[0].name);
    setProfileTitle(profileFormItem[0].profileTitle);
    setImg(profileFormItem[0].image);
    setCountry(profileFormItem[0].country);
    setDescription(profileFormItem[0].description);
    setUrl(profileFormItem[0].urlS);
    setTwitterLink(profileFormItem[0].twitterLink);
    setEmailAdd(profileFormItem[0].emailAdd);
    setPhoneNo(profileFormItem[0].phoneNo);
  }

  function handleOpenPort(img) {
    setPortImgOpen(true);
    setPortImgBig(img);
  }

  async function loadBuyer() {
    setLoading(true);
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAcc(account[0]);

    const noOfuser = await skillswap.noOfBuyers();

    for (let index = 1; index <= noOfuser.toString(); index++) {
      const user = await skillswap.buyerProfile(index);
      if (user.account.toLowerCase() === account[0]) {
        const response = await fetch(
          "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
        );
        const metadata = await response.json();
        setDisplayBuyer([metadata.profile]);
        setProfileFormItem([metadata.profile]);
      }
    }
    setLoading(false);
  }
  async function loadUser() {
    setLoading(true);
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setCurrentAcc(account[0]);

    const noOfuser = await skillswap.noOfSellers();

    for (let index = 1; index <= noOfuser.toString(); index++) {
      const user = await skillswap.sellerProfile(index);
      if (user.account.toLowerCase() === account[0]) {
        const response = await fetch(
          "https://gateway.ipfscdn.io/ipfs/" + user.uri + "/0"
        );
        const metadata = await response.json();
        setDisplayProfile([metadata.profile]);
        setDisplayGig([metadata.gig]);
        setReviewItems(metadata.rewiews);
        setProfileFormItem([metadata.profile]);
        setGigFormItem([metadata.gig]);
        console.log(metadata.gig.isPriceFree);
        let totalRating = 0;
        if (metadata.rewiews !== undefined) {
          for (let i = 0; i < metadata.rewiews.length; i++) {
            totalRating =
              parseInt(totalRating) + parseInt(metadata.rewiews[i].stars);
          }
          const avgRating = totalRating / metadata.rewiews.length;
          setShowAvgStar(avgRating);
        }
      }
    }
    setLoading(false);
  }

  async function uploadToIPFS(event, setPic) {
    event.preventDefault();
    const file = event.target.files[0];
    const MIN_FILE_SIZE = 1024; // 1MB
    const MAX_FILE_SIZE = 2048;
    const fileSizeKiloBytes = file.size / 1024;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        async function upLoadFormatedImg() {
          console.log(setPic)
          if (
            file && //!!file
            fileSizeKiloBytes < MAX_FILE_SIZE &&
            setPic === "setGigImg"
          ) {

            try {
              const formData = new FormData();

              formData.append("file", file);

              const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                  pinata_api_key: `83828a285ed6ac100f38`,
                  pinata_secret_api_key: `0a87dafa6567074b4754a03e10341a813b8fe372f86e12d559a66a61b14398eb`,
                  "Content-Type": "multipart/form-data",
                },
              });
              const ImgHash = `${resFile.data.IpfsHash}`;
              setGigImg(ImgHash);
            } catch (error) {
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
                  msg: "Error sending file to IPFS",
                  isErr: true,
                },
              ]);
            }
          } else if (
            file &&
            fileSizeKiloBytes < MAX_FILE_SIZE &&
            img.width === 1000 &&
            img.height === 1000 &&
            setPic === "setImg"
          ) {
            try {
              const formData = new FormData();
              formData.append("file", file);
              const resFile = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                  pinata_api_key: `83828a285ed6ac100f38`,
                  pinata_secret_api_key: `0a87dafa6567074b4754a03e10341a813b8fe372f86e12d559a66a61b14398eb`,
                  "Content-Type": "multipart/form-data",
                },
              });
              const ImgHash = `${resFile.data.IpfsHash}`;
              setImg(ImgHash);
            } catch (error) {
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
                  msg: "Error sending file to IPFS",
                  isErr: true,
                },
              ]);
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
                msg: "Please select a file with size below 2MB and with 1000 x 1000 px dimensions",
                isErr: true,
              },
            ]);
          }
        }
        upLoadFormatedImg();
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }

  async function uploadPortfolioToIPFS(event) {
    event.preventDefault();
    let imgsArr = [];
    if (event.target.files.length <= 5) {
      for (let i = 0; i < event.target.files.length; i++) {
        const file = event.target.files[i];
        const MAX_FILE_SIZE = 2048;
        const fileSizeKiloBytes = file.size / 1024;
        if (file && fileSizeKiloBytes < MAX_FILE_SIZE) {
          try {
            const formData = new FormData();
            formData.append("file", file);
            const resFile = await axios({
              method: "post",
              url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
              data: formData,
              headers: {
                pinata_api_key: `83828a285ed6ac100f38`,
                pinata_secret_api_key: `0a87dafa6567074b4754a03e10341a813b8fe372f86e12d559a66a61b14398eb`,
                "Content-Type": "multipart/form-data",
              },
            });
            const ImgHash = `${resFile.data.IpfsHash}`;
            imgsArr.push(ImgHash);
          } catch (error) {
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
                msg: "Error sending file to IPFS!",
                isErr: true,
              },
            ]);
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
              msg: "Error sending file to IPFS! The image size must be below 5mb.",
              isErr: true,
            },
          ]);
        }
      }
      setPortfolioImgs(imgsArr);
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
          msg: "You can only upload 5 or less images!",
          isErr: true,
        },
      ]);
    }
  }

  async function uploadFileToStorage() {
    setLoading(true);
    const profile = {
      userAs: selectUser,
      name: name,
      profileTitle: profileTitle,
      description: description,
      country: country,
      urlS: urlS,
      twitterLink: twitterLink,
      skill: skill,
      image: img,
      language: lang,
      education: education,
    };
    const gig = {
      gigImg: gigImg,
      portfolioImgs: portfolioImgs,
      gigHead: gigHead,
      gigDescription: gigDescrip,
      gigCategory: gigCategory,
      gigPrice: gigPrice,
      weeklyPrice: weeklyPrice,
      monthlyPrice: monthlyPrice,
      fixedPrice: fixedPrice,
      isPriceFree: isPriceFree,
      gigBullPrice: gigBullPrice,
      gigKeywords: gigKeywords,
    };

    const uri = await storage.upload({ profile: profile, gig: gig });
    const urlRemoved = uri.replace("ipfs://", "");
    const url = urlRemoved.replace("/0", "");
    await skillswap.setProfile(url, 0);
    setLoading(false);
  }

  async function uploadBuyerToStorage() {
    setLoading(true);
    const profile = {
      userAs: selectUser,
      name: name,
      profileTitle: profileTitle,
      description: description,
      country: country,
      urlS: urlS,
      twitterLink: twitterLink,
      emailAdd: emailAdd,
      phoneNo: phoneNo,
      image: img,
    };
    const uri = await storage.upload({ profile: profile });
    const urlRemoved = uri.replace("ipfs://", "");
    const url = urlRemoved.replace("/0", "");
    await skillswap.setProfile(url, 1);
    setLoading(false);
  }

  async function saveEdit() {
    setLoading(true);
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const noOfuser = await skillswap.noOfSellers();
    for (let i = 1; i <= noOfuser.toString(); i++) {
      const element = await skillswap.sellerProfile(i);
      if (element.account.toLowerCase() === account[0].toLowerCase()) {
        const profile = {
          name: name,
          profileTitle: profileTitle,
          description: description,
          country: country,
          urlS: urlS,
          twitterLink: twitterLink,
          skill: skill,
          image: img,
          language: lang,
          education: education,
        };
        const gig = {
          gigImg: gigImg,
          portfolioImgs: portfolioImgs,
          gigHead: gigHead,
          gigDescription: gigDescrip,
          gigCategory: gigCategory,
          gigPrice: gigPrice,
          weeklyPrice: weeklyPrice,
          monthlyPrice: monthlyPrice,
          fixedPrice: fixedPrice,
          isPriceFree: isPriceFree,
          gigBullPrice: gigBullPrice,
          gigKeywords: gigKeywords,
        };

        const response = await fetch(
          "https://gateway.ipfscdn.io/ipfs/" + element.uri + "/0"
        );
        const metadata = await response.json();
        if (metadata.rewiews !== undefined) {
          const uri = await storage.upload({
            profile: profile,
            gig: gig,
            rewiews: metadata.rewiews,
          });
          const urlRemoved = uri.replace("ipfs://", "");
          const url = urlRemoved.replace("/0", "");
          await skillswap.updateProfile(url, i, 0);
        } else {
          const uri = await storage.upload({ profile: profile, gig: gig });
          const urlRemoved = uri.replace("ipfs://", "");
          const url = urlRemoved.replace("/0", "");
          await skillswap.updateProfile(url, i, 0);
        }
      }
    }
    setLoading(false);
  }
  async function saveBuyerEdit() {
    setLoading(true);
    const account = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const noOfuser = await skillswap.noOfBuyers();
    for (let i = 1; i <= noOfuser.toString(); i++) {
      const element = await skillswap.buyerProfile(i);
      if (element.account.toLowerCase() === account[0].toLowerCase()) {
        const profile = {
          name: name,
          profileTitle: profileTitle,
          description: description,
          country: country,
          urlS: urlS,
          twitterLink: twitterLink,
          emailAdd: emailAdd,
          phoneNo: phoneNo,
          image: img,
        };

        const uri = await storage.upload({ profile: profile });
        const urlRemoved = uri.replace("ipfs://", "");
        const url = urlRemoved.replace("/0", "");
        const edited = await skillswap.updateProfile(url, i, 1);
      }
    }
    setLoading(false);
  }

  function copyLink() {
    navigator.clipboard.writeText(
      "https://skillswap-c4225.web.app/seller/" +
        currentAcc.replace("0x", "").toLowerCase()
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
        msg: "Link copied to clipboard",
        isErr: false,
      },
    ]);
  }
  function copyBuyerLink() {
    navigator.clipboard.writeText(
      "https://skillswap-c4225.web.app/contractor/" +
        currentAcc.replace("0x", "").toLowerCase()
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
        msg: "Link copied to clipboard",
        isErr: false,
      },
    ]);
  }

  function messageToWaitForMM(reason) {
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
        msg: reason,
        isErr: false,
      },
    ]);
    navigate("/");
  }

  function displayError(errMsg) {
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
        msg: "We're facing some problem creating/saving your profile. Please try again.",
        isErr: true,
      },
    ]);
    setLoading(false);
  }

  function makeAccount() {
    uploadFileToStorage()
      .then(() =>
        messageToWaitForMM(
          "Your profile will be created after the metamask transaction is completed"
        )
      )
      .catch((reason) => displayError(reason));
  }

  function makeBuyerAccount() {
    uploadBuyerToStorage()
      .then(() =>
        messageToWaitForMM(
          "Your profile will be created after the metamask transaction is completed"
        )
      )
      .catch((reason) => displayError(reason));
  }

  function saveChanges() {
    saveEdit()
      .then(() =>
        messageToWaitForMM(
          "Your profile will be updated after the metamask transaction is completed"
        )
      )
      .catch((reason) => displayError(reason));
  }

  function saveBuyerChanges() {
    saveBuyerEdit()
      .then(() =>
        messageToWaitForMM(
          "Your profile will be updated after the metamask transaction is completed"
        )
      )
      .catch((reason) => displayError("Problem " + reason));
  }

  function closeSidebar() {
    if (window.innerWidth < 995) {
      setIsOpen(true);
    }
  }
  function openSidebar() {
    if (window.innerWidth < 995) {
      setIsOpen(false);
    }
  }

  useEffect(() => {
    async function displayUser() {
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const sellerBool = await skillswap.isSeller(account[0]);
      const buyerBool = await skillswap.isBuyer(account[0]);
      if (sellerBool) {
        setUserLogin(true);
        setIsUserSelected(true);
        setSelectUser("freelancer");
        loadUser();
      } else if (buyerBool) {
        setUserLogin(true);
        setIsUserSelected(true);
        setSelectUser("client");
        loadBuyer();
      } else {
        setUserLogin(false);
      }
    }
    displayUser();
    // eslint-disable-next-line
  }, []);

  return (
    <Wrapper>
      {userLogin ? (
        //
        //Profile section starts here
        //2 profile component and 1 gig
        //
        <Container>
          {loading ? (
            <Loading />
          ) : (
            <div>
              {selectUser === "freelancer" && (
                <ProfileContent className={` ${isOpen ? "" : "gridOneColumn"}`}>
                  {displayProfile.map((profileData, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <YourDetail>
                        <PPContainer>
                          <img
                            src={`https://gateway.ipfscdn.io/ipfs/${profileData.image}`}
                            alt={profileData.name}
                          />
                        </PPContainer>
                        <YourName>
                          <div>
                            <h3>{profileData.name}</h3>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "end",
                                width: "20%",
                              }}
                            >
                              <svg
                                width="64px"
                                height="64px"
                                viewBox="0 0 24 24"
                                fill="#5fd3f3"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ cursor: "pointer" }}
                                onClick={copyLink}
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
                                    d="M18 20.75H6C5.27065 20.75 4.57118 20.4603 4.05546 19.9445C3.53973 19.4288 3.25 18.7293 3.25 18V6C3.25 5.27065 3.53973 4.57118 4.05546 4.05546C4.57118 3.53973 5.27065 3.25 6 3.25H12C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4C12.75 4.19891 12.671 4.38968 12.5303 4.53033C12.3897 4.67098 12.1989 4.75 12 4.75H6C5.66848 4.75 5.35054 4.8817 5.11612 5.11612C4.8817 5.35054 4.75 5.66848 4.75 6V18C4.75 18.3315 4.8817 18.6495 5.11612 18.8839C5.35054 19.1183 5.66848 19.25 6 19.25H18C18.3315 19.25 18.6495 19.1183 18.8839 18.8839C19.1183 18.6495 19.25 18.3315 19.25 18V12C19.25 11.8011 19.329 11.6103 19.4697 11.4697C19.6103 11.329 19.8011 11.25 20 11.25C20.1989 11.25 20.3897 11.329 20.5303 11.4697C20.671 11.6103 20.75 11.8011 20.75 12V18C20.75 18.7293 20.4603 19.4288 19.9445 19.9445C19.4288 20.4603 18.7293 20.75 18 20.75Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                  <path
                                    d="M20 8.75C19.8019 8.74741 19.6126 8.66756 19.4725 8.52747C19.3324 8.38737 19.2526 8.19811 19.25 8V4.75H16C15.8011 4.75 15.6103 4.67098 15.4697 4.53033C15.329 4.38968 15.25 4.19891 15.25 4C15.25 3.80109 15.329 3.61032 15.4697 3.46967C15.6103 3.32902 15.8011 3.25 16 3.25H20C20.1981 3.25259 20.3874 3.33244 20.5275 3.47253C20.6676 3.61263 20.7474 3.80189 20.75 4V8C20.7474 8.19811 20.6676 8.38737 20.5275 8.52747C20.3874 8.66756 20.1981 8.74741 20 8.75Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                  <path
                                    d="M13.5 11.25C13.3071 11.2352 13.1276 11.1455 13 11C12.877 10.8625 12.809 10.6845 12.809 10.5C12.809 10.3155 12.877 10.1375 13 10L19.5 3.5C19.5687 3.42631 19.6515 3.36721 19.7435 3.32622C19.8355 3.28523 19.9348 3.26319 20.0355 3.26141C20.1362 3.25963 20.2362 3.27816 20.3296 3.31588C20.423 3.3536 20.5078 3.40974 20.579 3.48096C20.6503 3.55218 20.7064 3.63701 20.7441 3.7304C20.7818 3.82379 20.8004 3.92382 20.7986 4.02452C20.7968 4.12523 20.7748 4.22454 20.7338 4.31654C20.6928 4.40854 20.6337 4.49134 20.56 4.56L14 11C13.8724 11.1455 13.6929 11.2352 13.5 11.25Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                </g>
                              </svg>
                              <svg
                                title="Edit profile"
                                onClick={handleEditProfile}
                                viewBox="0 0 24 24"
                                fill="#1d1d21"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "20px",
                                }}
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
                                    d="M18.9445 9.1875L14.9445 5.1875M18.9445 9.1875L13.946 14.1859C13.2873 14.8446 12.4878 15.3646 11.5699 15.5229C10.6431 15.6828 9.49294 15.736 8.94444 15.1875C8.39595 14.639 8.44915 13.4888 8.609 12.562C8.76731 11.6441 9.28735 10.8446 9.946 10.1859L14.9445 5.1875M18.9445 9.1875C18.9445 9.1875 21.9444 6.1875 19.9444 4.1875C17.9444 2.1875 14.9445 5.1875 14.9445 5.1875M20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12C3.5 5.5 5.5 3.5 12 3.5"
                                    stroke="#5fd3f3"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>{" "}
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div style={{ margin: "10px 0" }}>
                            <Rating
                              name="half-rating-read"
                              value={parseInt(showAvgStar)}
                              readOnly
                            />
                          </div>
                          <div>
                            <p
                              style={{
                                color: "var(--darkText)",
                                marginTop: "10px",
                              }}
                            >
                              {profileData.profileTitle}
                            </p>
                          </div>
                        </YourName>
                        <YourOthers>
                          <ul>
                            {profileData.urlS !== undefined &&
                              profileData.urlS !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="#5fd3f3"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.975 14.51a1.05 1.05 0 0 0 0-1.485 2.95 2.95 0 0 1 0-4.172l3.536-3.535a2.95 2.95 0 1 1 4.172 4.172l-1.093 1.092a1.05 1.05 0 0 0 1.485 1.485l1.093-1.092a5.05 5.05 0 0 0-7.142-7.142L9.49 7.368a5.05 5.05 0 0 0 0 7.142c.41.41 1.075.41 1.485 0zm2.05-5.02a1.05 1.05 0 0 0 0 1.485 2.95 2.95 0 0 1 0 4.172l-3.5 3.5a2.95 2.95 0 1 1-4.171-4.172l1.025-1.025a1.05 1.05 0 0 0-1.485-1.485L3.87 12.99a5.05 5.05 0 0 0 7.142 7.142l3.5-3.5a5.05 5.05 0 0 0 0-7.142 1.05 1.05 0 0 0-1.485 0z"
                                        fill="#5fd3f3"
                                      ></path>
                                    </g>
                                  </svg>
                                  <a href={profileData.urlS}>Website</a>
                                </li>
                              )}
                            {profileData.twitterLink !== undefined &&
                              profileData.twitterLink !== "" && (
                                <li>
                                  <svg
                                    fill="#5fd3f3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid"
                                    viewBox="0 0 31.812 26"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path d="M20.877,2.000 C22.519,2.000 24.382,2.652 25.426,3.738 C26.724,3.486 27.949,3.025 29.050,2.386 C28.625,3.687 27.718,4.779 26.540,5.469 C27.693,5.332 28.797,5.035 29.820,4.590 C29.054,5.707 28.087,6.690 26.971,7.477 C26.981,7.715 26.987,7.955 26.987,8.195 C26.987,15.562 21.445,24.000 10.939,24.000 C7.715,24.000 4.507,23.133 1.982,21.551 C2.428,21.605 2.883,21.631 3.343,21.631 C6.019,21.631 8.482,20.740 10.439,19.242 C7.937,19.199 5.827,17.586 5.103,15.373 C5.450,15.437 5.810,15.473 6.178,15.473 C6.696,15.473 7.203,15.406 7.681,15.277 C5.068,14.768 3.100,12.514 3.100,9.813 C3.100,9.787 3.100,9.764 3.100,9.740 C3.871,10.158 4.750,10.410 5.687,10.440 C4.154,9.437 3.147,7.734 3.147,5.799 C3.147,4.777 3.428,3.818 3.919,2.998 C6.735,6.367 10.945,8.588 15.693,8.822 C15.594,8.414 15.543,7.984 15.543,7.553 C15.543,4.473 17.721,2.000 20.877,2.000 M29.820,4.590 L29.825,4.590 M20.877,-0.000 C17.033,-0.000 14.060,2.753 13.614,6.552 C10.425,5.905 7.524,4.204 5.440,1.711 C5.061,1.257 4.503,0.998 3.919,0.998 C3.867,0.998 3.815,1.000 3.763,1.004 C3.123,1.055 2.547,1.413 2.216,1.966 C1.525,3.122 1.159,4.447 1.159,5.799 C1.159,6.700 1.321,7.579 1.625,8.400 C1.300,8.762 1.113,9.238 1.113,9.740 L1.113,9.813 C1.113,11.772 1.882,13.589 3.160,14.952 C3.087,15.294 3.103,15.655 3.215,15.998 C3.657,17.348 4.459,18.510 5.499,19.396 C4.800,19.552 4.079,19.631 3.343,19.631 C2.954,19.631 2.577,19.609 2.222,19.565 C2.141,19.556 2.061,19.551 1.981,19.551 C1.148,19.551 0.391,20.078 0.108,20.886 C-0.202,21.770 0.140,22.753 0.932,23.249 C3.764,25.023 7.318,26.000 10.939,26.000 C17.778,26.000 22.025,22.843 24.383,20.195 C27.243,16.984 28.907,12.718 28.972,8.455 C29.899,7.682 30.717,6.790 31.410,5.792 C31.661,5.458 31.810,5.041 31.810,4.590 C31.810,3.909 31.473,3.308 30.958,2.946 C31.181,2.176 30.925,1.342 30.303,0.833 C29.940,0.537 29.496,0.386 29.049,0.386 C28.708,0.386 28.365,0.474 28.056,0.654 C27.391,1.040 26.680,1.344 25.931,1.562 C24.555,0.592 22.688,-0.000 20.877,-0.000 L20.877,-0.000 Z"></path>{" "}
                                    </g>
                                  </svg>
                                  <a
                                    href={
                                      "https://twitter.com/" +
                                      profileData.twitterLink
                                    }
                                  >
                                    {profileData.twitterLink}
                                  </a>
                                </li>
                              )}
                            {profileData.country !== undefined &&
                              profileData.country !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M12.8159 20.6077C16.8509 18.5502 20 15.1429 20 11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11C4 15.1429 7.14909 18.5502 11.1841 20.6077C11.6968 20.8691 12.3032 20.8691 12.8159 20.6077Z"
                                        stroke="#5fd3f3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>{" "}
                                      <path
                                        d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z"
                                        stroke="#5fd3f3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                  </svg>
                                  <p style={{ marginLeft: "7px" }}>
                                    {profileData.country}
                                  </p>
                                </li>
                              )}
                            {profileData.language !== undefined &&
                              profileData.language.length !== 0 && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="#5fd3f3"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      <path
                                        d="M20.58 19.37L17.59 11.01C17.38 10.46 16.91 10.12 16.37 10.12C15.83 10.12 15.37 10.46 15.14 11.03L12.16 19.37C12.02 19.76 12.22 20.19 12.61 20.33C13 20.47 13.43 20.27 13.57 19.88L14.19 18.15H18.54L19.16 19.88C19.27 20.19 19.56 20.38 19.87 20.38C19.95 20.38 20.04 20.37 20.12 20.34C20.51 20.2 20.71 19.77 20.57 19.38L20.58 19.37ZM14.74 16.64L16.38 12.05L18.02 16.64H14.74ZM12.19 7.85C9.92999 11.42 7.89 13.58 5.41 15.02C5.29 15.09 5.16 15.12 5.04 15.12C4.78 15.12 4.53 14.99 4.39 14.75C4.18 14.39 4.3 13.93 4.66 13.73C6.75999 12.51 8.48 10.76 10.41 7.86H4.12C3.71 7.86 3.37 7.52 3.37 7.11C3.37 6.7 3.71 6.36 4.12 6.36H7.87V4.38C7.87 3.97 8.21 3.63 8.62 3.63C9.02999 3.63 9.37 3.97 9.37 4.38V6.36H13.12C13.53 6.36 13.87 6.7 13.87 7.11C13.87 7.52 13.53 7.86 13.12 7.86H12.18L12.19 7.85ZM12.23 15.12C12.1 15.12 11.97 15.09 11.85 15.02C11.2 14.64 10.57 14.22 9.97999 13.78C9.64999 13.53 9.58 13.06 9.83 12.73C10.08 12.4 10.55 12.33 10.88 12.58C11.42 12.99 12.01 13.37 12.61 13.72C12.97 13.93 13.09 14.39 12.88 14.75C12.74 14.99 12.49 15.12 12.23 15.12Z"
                                        fill="##5fd3f3"
                                      ></path>
                                    </g>
                                  </svg>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "start",
                                      flexWrap: "wrap",
                                    }}
                                  >
                                    {profileData.language.map(
                                      (langData, idx) => (
                                        <div
                                          style={{ margin: "0 10px" }}
                                          key={idx}
                                        >
                                          {langData}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </li>
                              )}
                          </ul>
                        </YourOthers>
                        <YourDes>
                          <span>About Me</span>
                          <p>{profileData.description}</p>
                        </YourDes>
                        <YourSkills>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              flexWrap: "wrap",
                            }}
                          >
                            <svg
                              width="64px"
                              height="64px"
                              viewBox="0 0 24 24"
                              fill="#5fd3f3"
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
                                  d="M19 9C19 10.45 18.57 11.78 17.83 12.89C16.75 14.49 15.04 15.62 13.05 15.91C12.71 15.97 12.36 16 12 16C11.64 16 11.29 15.97 10.95 15.91C8.96 15.62 7.25 14.49 6.17 12.89C5.43 11.78 5 10.45 5 9C5 5.13 8.13 2 12 2C15.87 2 19 5.13 19 9Z"
                                  stroke="#1d1d21"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M21.25 18.47L19.6 18.86C19.23 18.95 18.94 19.23 18.86 19.6L18.51 21.07C18.32 21.87 17.3 22.11 16.77 21.48L12 16L7.22996 21.49C6.69996 22.12 5.67996 21.88 5.48996 21.08L5.13996 19.61C5.04996 19.24 4.75996 18.95 4.39996 18.87L2.74996 18.48C1.98996 18.3 1.71996 17.35 2.26996 16.8L6.16996 12.9C7.24996 14.5 8.95996 15.63 10.95 15.92C11.29 15.98 11.64 16.01 12 16.01C12.36 16.01 12.71 15.98 13.05 15.92C15.04 15.63 16.75 14.5 17.83 12.9L21.73 16.8C22.28 17.34 22.01 18.29 21.25 18.47Z"
                                  stroke="#1d1d21"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M12.58 5.98L13.17 7.15999C13.25 7.31999 13.46 7.48 13.65 7.51L14.72 7.68999C15.4 7.79999 15.56 8.3 15.07 8.79L14.24 9.61998C14.1 9.75998 14.02 10.03 14.07 10.23L14.31 11.26C14.5 12.07 14.07 12.39 13.35 11.96L12.35 11.37C12.17 11.26 11.87 11.26 11.69 11.37L10.69 11.96C9.96997 12.38 9.53997 12.07 9.72997 11.26L9.96997 10.23C10.01 10.04 9.93997 9.75998 9.79997 9.61998L8.96997 8.79C8.47997 8.3 8.63997 7.80999 9.31997 7.68999L10.39 7.51C10.57 7.48 10.78 7.31999 10.86 7.15999L11.45 5.98C11.74 5.34 12.26 5.34 12.58 5.98Z"
                                  stroke="#1d1d21"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                            <p
                              style={{
                                fontSize: "20px",
                                marginLeft: "10px",
                              }}
                            >
                              Skills
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              flexWrap: "wrap",
                            }}
                          >
                            {profileData.skill !== undefined &&
                              profileData.skill.map((skillData, idx) => (
                                <div
                                  style={{
                                    margin: "10px",
                                    padding: "7px",
                                    borderRadius: "5px",
                                    border: "1px solid var(--line)",
                                    marginLeft: "0",
                                  }}
                                  key={idx}
                                >
                                  {skillData}
                                </div>
                              ))}
                          </div>
                        </YourSkills>
                        <YourEducation>
                          {" "}
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              flexWrap: "wrap",
                            }}
                          >
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
                                  d="M11.5655 4.24138L3.64286 8.64286C3.36266 8.79852 3.36266 9.20148 3.64286 9.35714L11.5655 13.7586C11.8357 13.9087 12.1643 13.9087 12.4345 13.7586L20.5706 9.23853C20.7578 9.13456 20.7578 8.86544 20.5706 8.76147L12.4345 4.24138C12.1643 4.09126 11.8357 4.09126 11.5655 4.24138Z"
                                  stroke="#5fd3f3"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M5.5 10.5L5.13149 15.2906C5.05583 16.2742 5.70934 17.1639 6.66043 17.426C7.28355 17.5976 7.96876 17.8017 8.5 18C9.26467 18.2854 10.1126 18.7657 10.7824 19.1841C11.5227 19.6465 12.4773 19.6465 13.2177 19.184C13.8874 18.7657 14.7354 18.2854 15.5 18C16.0312 17.8017 16.7165 17.5976 17.3396 17.4259C18.2907 17.1639 18.9442 16.2742 18.8686 15.2906L18.5 10.5"
                                  stroke="#5fd3f3"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                                <path
                                  d="M11.5 10.5L9.00772 11.9242C8.38457 12.2802 8 12.9429 8 13.6606V20"
                                  stroke="#5fd3f3"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                ></path>{" "}
                              </g>
                            </svg>
                            <p
                              style={{
                                fontSize: "20px",
                                marginLeft: "10px",
                              }}
                            >
                              Education
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                              flexWrap: "wrap",
                            }}
                          >
                            {" "}
                            {profileData.education !== undefined && (
                              <div>
                                {profileData.education.map((eduData, idx) => (
                                  <div
                                    style={{
                                      margin: "10px",
                                      padding: "7px",
                                      borderRadius: "5px",
                                      border: "1px solid var(--line)",
                                      marginLeft: "0",
                                    }}
                                    key={idx}
                                  >
                                    {eduData}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </YourEducation>
                      </YourDetail>
                    </div>
                  ))}
                  {displayGig.map((gigData, idx) => (
                    <YourService
                      key={idx}
                      style={{ display: ` ${isOpen ? "grid" : "none"}` }}
                    >
                      <ServiceHead>
                        <h2>{gigData.gigHead}</h2>
                        <ServiceImg
                          style={{
                            background: `url(https://gateway.ipfscdn.io/ipfs/${gigData.gigImg})`,
                            backgroundPosition: "center",
                            backgroundSize: "cover",
                            backgroundRepeat: "no-repeat",
                          }}
                        ></ServiceImg>
                      </ServiceHead>
                      <Offer>
                        <span>Fixed Price:</span>
                        <h4>
                          <span style={{ color: "#5fd3f3" }}>$</span>{" "}
                          {gigData.fixedPrice}
                        </h4>
                        <br />
                        <br />
                        {gigData.isPriceFree !== undefined && (
                          <span>{gigData.isPriceFree}</span>
                        )}
                        <br />
                        <br />
                        {gigData.weeklyPrice !== undefined &&
                          gigData.weeklyPrice !== 0 && (
                            <div>
                              <span>Fixed Weekly Payment:</span>
                              <h4>
                                <span style={{ color: "#5fd3f3" }}>$</span>{" "}
                                {gigData.weeklyPrice}
                              </h4>
                              <br />
                              <br />
                            </div>
                          )}
                        {gigData.monthlyPrice !== undefined &&
                          gigData.monthlyPrice !== 0 && (
                            <div>
                              <span>Fixed Monthly Payment:</span>
                              <h4>
                                <span style={{ color: "#5fd3f3" }}>$</span>{" "}
                                {gigData.monthlyPrice}
                              </h4>
                              <br />
                              <br />
                            </div>
                          )}
                        {gigData.gigPrice !== undefined &&
                          gigData.gigPrice !== 0 && (
                            <div>
                              <span>Bear Market Price:</span>
                              <h4>
                                <span style={{ color: "#5fd3f3" }}>$</span>{" "}
                                {gigData.gigPrice}
                              </h4>
                              <br />
                              <br />
                            </div>
                          )}
                        {gigData.gigBullPrice !== undefined &&
                          gigData.gigBullPrice !== 0 && (
                            <div>
                              <span>Bull Market Price:</span>
                              <h4>
                                <span style={{ color: "#5fd3f3" }}>$</span>{" "}
                                {gigData.gigBullPrice}
                              </h4>
                            </div>
                          )}
                      </Offer>
                      <ServiceDes>
                        <span>Service Description: </span>
                        <p>{gigData.gigDescription}</p>
                      </ServiceDes>
                      {gigData.portfolioImgs !== undefined &&
                        gigData.portfolioImgs.length !== 0 && (
                          <PortfolioCarousel>
                            <span>Portfolio</span>
                            <br />
                            <Carousel>
                              {gigData.portfolioImgs.map((portImgs, id) => (
                                <div
                                  key={id}
                                  onClick={() => handleOpenPort(portImgs)}
                                  style={{ cursor: "pointer" }}
                                >
                                  <img
                                    src={`https://gateway.ipfscdn.io/ipfs/${portImgs}`}
                                    alt="portfolioImgs"
                                  />
                                </div>
                              ))}
                            </Carousel>
                          </PortfolioCarousel>
                        )}
                      {portImgOpen && (
                        <PortImgModal>
                          <div className="portImg">
                            <div className="portImgContainer">
                              <div
                                className="closeModal"
                                onClick={() => setPortImgOpen(false)}
                              >
                                ×
                              </div>
                              <img
                                src={`https://gateway.ipfscdn.io/ipfs/${portImgBig}`}
                                alt="portImgBig"
                              />
                            </div>
                          </div>
                        </PortImgModal>
                      )}
                      {reviewItems !== undefined && reviewItems.length > 0 && (
                        <Review>
                          <span>Feedbacks</span>
                          {reviewItems.map((reviewData, id) => (
                            <div className="reviewContent" key={id}>
                              <div className="stars">
                                <Rating
                                  name="read-only"
                                  value={parseInt(reviewData.stars)}
                                  readOnly
                                  style={{ margin: "0" }}
                                />
                              </div>
                              <div className="by">{reviewData.reviewBy}</div>
                              <div className="feedback">
                                {reviewData.feedback}
                              </div>
                            </div>
                          ))}
                        </Review>
                      )}
                    </YourService>
                  ))}
                </ProfileContent>
              )}
              {selectUser === "client" && (
                <ProfileBuyerContent>
                  {displayBuyer.map((profileData, idx) => (
                    <div key={idx}>
                      <BuyerDetail>
                        <PPContainer className="buyerPic">
                          <img
                            src={`https://gateway.ipfscdn.io/ipfs/${profileData.image}`}
                            alt={profileData.name}
                          />
                        </PPContainer>
                        <YourName className="buyerName">
                          <div>
                            <h3>{profileData.name}</h3>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "end",
                                width: "20%",
                              }}
                            >
                              <svg
                                width="64px"
                                height="64px"
                                viewBox="0 0 24 24"
                                fill="#5fd3f3"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ cursor: "pointer" }}
                                onClick={copyBuyerLink}
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
                                    d="M18 20.75H6C5.27065 20.75 4.57118 20.4603 4.05546 19.9445C3.53973 19.4288 3.25 18.7293 3.25 18V6C3.25 5.27065 3.53973 4.57118 4.05546 4.05546C4.57118 3.53973 5.27065 3.25 6 3.25H12C12.1989 3.25 12.3897 3.32902 12.5303 3.46967C12.671 3.61032 12.75 3.80109 12.75 4C12.75 4.19891 12.671 4.38968 12.5303 4.53033C12.3897 4.67098 12.1989 4.75 12 4.75H6C5.66848 4.75 5.35054 4.8817 5.11612 5.11612C4.8817 5.35054 4.75 5.66848 4.75 6V18C4.75 18.3315 4.8817 18.6495 5.11612 18.8839C5.35054 19.1183 5.66848 19.25 6 19.25H18C18.3315 19.25 18.6495 19.1183 18.8839 18.8839C19.1183 18.6495 19.25 18.3315 19.25 18V12C19.25 11.8011 19.329 11.6103 19.4697 11.4697C19.6103 11.329 19.8011 11.25 20 11.25C20.1989 11.25 20.3897 11.329 20.5303 11.4697C20.671 11.6103 20.75 11.8011 20.75 12V18C20.75 18.7293 20.4603 19.4288 19.9445 19.9445C19.4288 20.4603 18.7293 20.75 18 20.75Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                  <path
                                    d="M20 8.75C19.8019 8.74741 19.6126 8.66756 19.4725 8.52747C19.3324 8.38737 19.2526 8.19811 19.25 8V4.75H16C15.8011 4.75 15.6103 4.67098 15.4697 4.53033C15.329 4.38968 15.25 4.19891 15.25 4C15.25 3.80109 15.329 3.61032 15.4697 3.46967C15.6103 3.32902 15.8011 3.25 16 3.25H20C20.1981 3.25259 20.3874 3.33244 20.5275 3.47253C20.6676 3.61263 20.7474 3.80189 20.75 4V8C20.7474 8.19811 20.6676 8.38737 20.5275 8.52747C20.3874 8.66756 20.1981 8.74741 20 8.75Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                  <path
                                    d="M13.5 11.25C13.3071 11.2352 13.1276 11.1455 13 11C12.877 10.8625 12.809 10.6845 12.809 10.5C12.809 10.3155 12.877 10.1375 13 10L19.5 3.5C19.5687 3.42631 19.6515 3.36721 19.7435 3.32622C19.8355 3.28523 19.9348 3.26319 20.0355 3.26141C20.1362 3.25963 20.2362 3.27816 20.3296 3.31588C20.423 3.3536 20.5078 3.40974 20.579 3.48096C20.6503 3.55218 20.7064 3.63701 20.7441 3.7304C20.7818 3.82379 20.8004 3.92382 20.7986 4.02452C20.7968 4.12523 20.7748 4.22454 20.7338 4.31654C20.6928 4.40854 20.6337 4.49134 20.56 4.56L14 11C13.8724 11.1455 13.6929 11.2352 13.5 11.25Z"
                                    fill="#5fd3f3"
                                  ></path>{" "}
                                </g>
                              </svg>
                              <svg
                                title="Edit profile"
                                onClick={handleBuyerEditProfile}
                                viewBox="0 0 24 24"
                                fill="#1d1d21"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{
                                  cursor: "pointer",
                                  marginLeft: "20px",
                                }}
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
                                    d="M18.9445 9.1875L14.9445 5.1875M18.9445 9.1875L13.946 14.1859C13.2873 14.8446 12.4878 15.3646 11.5699 15.5229C10.6431 15.6828 9.49294 15.736 8.94444 15.1875C8.39595 14.639 8.44915 13.4888 8.609 12.562C8.76731 11.6441 9.28735 10.8446 9.946 10.1859L14.9445 5.1875M18.9445 9.1875C18.9445 9.1875 21.9444 6.1875 19.9444 4.1875C17.9444 2.1875 14.9445 5.1875 14.9445 5.1875M20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12C3.5 5.5 5.5 3.5 12 3.5"
                                    stroke="#5fd3f3"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  ></path>{" "}
                                </g>
                              </svg>
                            </div>
                          </div>
                          <div>
                            <p
                              style={{
                                color: "var(--darkText)",
                                marginTop: "10px",
                              }}
                            >
                              {profileData.profileTitle}
                            </p>
                          </div>
                        </YourName>
                        <YourOthers className="buyerOthers">
                          <ul>
                            {profileData.urlS !== undefined &&
                              profileData.urlS !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="#5fd3f3"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.975 14.51a1.05 1.05 0 0 0 0-1.485 2.95 2.95 0 0 1 0-4.172l3.536-3.535a2.95 2.95 0 1 1 4.172 4.172l-1.093 1.092a1.05 1.05 0 0 0 1.485 1.485l1.093-1.092a5.05 5.05 0 0 0-7.142-7.142L9.49 7.368a5.05 5.05 0 0 0 0 7.142c.41.41 1.075.41 1.485 0zm2.05-5.02a1.05 1.05 0 0 0 0 1.485 2.95 2.95 0 0 1 0 4.172l-3.5 3.5a2.95 2.95 0 1 1-4.171-4.172l1.025-1.025a1.05 1.05 0 0 0-1.485-1.485L3.87 12.99a5.05 5.05 0 0 0 7.142 7.142l3.5-3.5a5.05 5.05 0 0 0 0-7.142 1.05 1.05 0 0 0-1.485 0z"
                                        fill="#5fd3f3"
                                      ></path>
                                    </g>
                                  </svg>
                                  <a href={profileData.urlS}>Website</a>
                                </li>
                              )}
                            {profileData.twitterLink !== undefined &&
                              profileData.twitterLink !== "" && (
                                <li>
                                  <svg
                                    fill="#5fd3f3"
                                    xmlns="http://www.w3.org/2000/svg"
                                    preserveAspectRatio="xMidYMid"
                                    viewBox="0 0 31.812 26"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path d="M20.877,2.000 C22.519,2.000 24.382,2.652 25.426,3.738 C26.724,3.486 27.949,3.025 29.050,2.386 C28.625,3.687 27.718,4.779 26.540,5.469 C27.693,5.332 28.797,5.035 29.820,4.590 C29.054,5.707 28.087,6.690 26.971,7.477 C26.981,7.715 26.987,7.955 26.987,8.195 C26.987,15.562 21.445,24.000 10.939,24.000 C7.715,24.000 4.507,23.133 1.982,21.551 C2.428,21.605 2.883,21.631 3.343,21.631 C6.019,21.631 8.482,20.740 10.439,19.242 C7.937,19.199 5.827,17.586 5.103,15.373 C5.450,15.437 5.810,15.473 6.178,15.473 C6.696,15.473 7.203,15.406 7.681,15.277 C5.068,14.768 3.100,12.514 3.100,9.813 C3.100,9.787 3.100,9.764 3.100,9.740 C3.871,10.158 4.750,10.410 5.687,10.440 C4.154,9.437 3.147,7.734 3.147,5.799 C3.147,4.777 3.428,3.818 3.919,2.998 C6.735,6.367 10.945,8.588 15.693,8.822 C15.594,8.414 15.543,7.984 15.543,7.553 C15.543,4.473 17.721,2.000 20.877,2.000 M29.820,4.590 L29.825,4.590 M20.877,-0.000 C17.033,-0.000 14.060,2.753 13.614,6.552 C10.425,5.905 7.524,4.204 5.440,1.711 C5.061,1.257 4.503,0.998 3.919,0.998 C3.867,0.998 3.815,1.000 3.763,1.004 C3.123,1.055 2.547,1.413 2.216,1.966 C1.525,3.122 1.159,4.447 1.159,5.799 C1.159,6.700 1.321,7.579 1.625,8.400 C1.300,8.762 1.113,9.238 1.113,9.740 L1.113,9.813 C1.113,11.772 1.882,13.589 3.160,14.952 C3.087,15.294 3.103,15.655 3.215,15.998 C3.657,17.348 4.459,18.510 5.499,19.396 C4.800,19.552 4.079,19.631 3.343,19.631 C2.954,19.631 2.577,19.609 2.222,19.565 C2.141,19.556 2.061,19.551 1.981,19.551 C1.148,19.551 0.391,20.078 0.108,20.886 C-0.202,21.770 0.140,22.753 0.932,23.249 C3.764,25.023 7.318,26.000 10.939,26.000 C17.778,26.000 22.025,22.843 24.383,20.195 C27.243,16.984 28.907,12.718 28.972,8.455 C29.899,7.682 30.717,6.790 31.410,5.792 C31.661,5.458 31.810,5.041 31.810,4.590 C31.810,3.909 31.473,3.308 30.958,2.946 C31.181,2.176 30.925,1.342 30.303,0.833 C29.940,0.537 29.496,0.386 29.049,0.386 C28.708,0.386 28.365,0.474 28.056,0.654 C27.391,1.040 26.680,1.344 25.931,1.562 C24.555,0.592 22.688,-0.000 20.877,-0.000 L20.877,-0.000 Z"></path>{" "}
                                    </g>
                                  </svg>
                                  <a
                                    href={
                                      "https://twitter.com/" +
                                      profileData.twitterLink
                                    }
                                  >
                                    {profileData.twitterLink}
                                  </a>
                                </li>
                              )}
                            {profileData.country !== undefined &&
                              profileData.country !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M12.8159 20.6077C16.8509 18.5502 20 15.1429 20 11C20 6.58172 16.4183 3 12 3C7.58172 3 4 6.58172 4 11C4 15.1429 7.14909 18.5502 11.1841 20.6077C11.6968 20.8691 12.3032 20.8691 12.8159 20.6077Z"
                                        stroke="#5fd3f3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>{" "}
                                      <path
                                        d="M15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11Z"
                                        stroke="#5fd3f3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>
                                    </g>
                                  </svg>
                                  <p style={{ marginLeft: "7px" }}>
                                    {profileData.country}
                                  </p>
                                </li>
                              )}
                            {profileData.emailAdd !== undefined &&
                              profileData.emailAdd !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <path
                                        d="M4 7.00005L10.2 11.65C11.2667 12.45 12.7333 12.45 13.8 11.65L20 7"
                                        stroke="#5fd3f3"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      ></path>{" "}
                                      <rect
                                        x="3"
                                        y="5"
                                        width="18"
                                        height="14"
                                        rx="2"
                                        stroke="#5fd3f3"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                      ></rect>{" "}
                                    </g>
                                  </svg>

                                  <p style={{ marginLeft: "7px" }}>
                                    {profileData.emailAdd}
                                  </p>
                                </li>
                              )}
                            {profileData.phoneNo !== undefined &&
                              profileData.phoneNo !== "" && (
                                <li>
                                  <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                  >
                                    <g
                                      id="SVGRepo_bgCarrier"
                                      strokeWidth="0"
                                    ></g>
                                    <g
                                      id="SVGRepo_tracerCarrier"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                    ></g>
                                    <g id="SVGRepo_iconCarrier">
                                      {" "}
                                      <g id="Communication / Phone">
                                        {" "}
                                        <path
                                          id="Vector"
                                          d="M9.50246 4.25722C9.19873 3.4979 8.46332 3 7.64551 3H4.89474C3.8483 3 3 3.8481 3 4.89453C3 13.7892 10.2108 21 19.1055 21C20.1519 21 21 20.1516 21 19.1052L21.0005 16.354C21.0005 15.5361 20.5027 14.8009 19.7434 14.4971L17.1069 13.4429C16.4249 13.1701 15.6483 13.2929 15.0839 13.7632L14.4035 14.3307C13.6089 14.9929 12.4396 14.9402 11.7082 14.2088L9.79222 12.2911C9.06079 11.5596 9.00673 10.3913 9.66895 9.59668L10.2363 8.9163C10.7066 8.35195 10.8305 7.57516 10.5577 6.89309L9.50246 4.25722Z"
                                          stroke="#5fd3f3"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                        ></path>{" "}
                                      </g>{" "}
                                    </g>
                                  </svg>
                                  <p style={{ marginLeft: "7px" }}>
                                    {profileData.phoneNo}
                                  </p>
                                </li>
                              )}
                          </ul>
                        </YourOthers>
                        <YourDes className="buyerDes">
                          <span>About</span>
                          <p>{profileData.description}</p>
                        </YourDes>
                      </BuyerDetail>
                    </div>
                  ))}
                </ProfileBuyerContent>
              )}
            </div>
          )}
        </Container>
      ) : (
        //
        //form starts from here
        //
        <Container>
          {loading ? (
            <Loading />
          ) : (
            <div>
              {isUserSelected ? (
                <div>
                  {selectUser === "freelancer" && (
                    <div>
                      <form onSubmit={editButton ? saveChanges : makeAccount}>
                        {firstPage ? (
                          //profile form
                          <ProfileContainer>
                            <h2>About Yourself</h2>
                            <WarningTxt>
                              <span>WARNING:</span> Any changes/ edits to a user
                              profile will cost gas fees, as the data is stored
                              on the blockchain. We encourage you to create your
                              account and fill out all necessary information in
                              one go to avoid any unnecessary gas fees. If you
                              want to create multiple gigs on SkillSwap, you
                              must use a different ETH wallet address for each
                              one. Thank you for your cooperation.
                            </WarningTxt>
                            <label>Name</label>
                            <input
                              type="text"
                              placeholder="Full name"
                              required
                              value={name}
                              spellCheck="true"
                              onChange={(e) => setName(e.target.value)}
                            />
                            <label>
                              Upload Profile Pic (max upload size 5 MB: 1000 x
                              1000 px)
                            </label>
                            {img ? (
                              <FormImg>
                                <img
                                  src={`https://gateway.ipfscdn.io/ipfs/${img}`}
                                  alt="skill swap user profile"
                                />
                              </FormImg>
                            ) : (
                              <div></div>
                            )}
                            <input
                              type="file"
                              // required
                              accept="image/*"
                              onChange={(event) =>
                                uploadToIPFS(event, "setImg")
                              }
                            />
                            <label>One Sentence Bio</label>
                            <input
                              type="text"
                              required
                              spellCheck="true"
                              placeholder="One Sentence Bio"
                              maxLength="100"
                              value={profileTitle}
                              onChange={(e) => setProfileTitle(e.target.value)}
                            />
                            <label>Country</label>
                            <select
                              name="country"
                              onChange={(e) => setCountry(e.target.value)}
                              defaultValue={country}
                              required
                            >
                              <option value="">Country...</option>
                              {countriesData.map((data, idx) => (
                                <option key={idx} value={data.code}>
                                  {data.name}
                                </option>
                              ))}
                            </select>
                            <label>Describe Yourself/ Full Bio</label>
                            <textarea
                              name="description"
                              cols="30"
                              rows="10"
                              spellCheck="true"
                              placeholder="Describe Yourself/ Full Bio"
                              required
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                            ></textarea>
                            <label>Your Website Link</label>
                            <input
                              type="url"
                              placeholder="Website Link"
                              spellCheck="true"
                              value={urlS}
                              onChange={(e) => setUrl(e.target.value)}
                            />
                            <label>Your Twitter Handle</label>
                            <input
                              type="url"
                              placeholder="@something"
                              spellCheck="true"
                              value={twitterLink}
                              onChange={(e) => setTwitterLink(e.target.value)}
                            />
                            <label>
                              Type your skills, after each skill press 'Enter'
                              on your keyboard
                            </label>
                            <TagsInput
                              style={{ border: "5px solid black !important" }}
                              value={skill}
                              onChange={setSkill}
                              name="skills"
                              placeHolder="Skills"
                            />
                            <label>
                              What languages do you speak, again after each word
                              press 'enter' on your keyboard
                            </label>

                            <TagsInput
                              value={lang}
                              onChange={setLang}
                              required
                              style={{ background: "black !important" }}
                              name="languages"
                              placeHolder="Languages you can speak"
                            />

                            <label>
                              Mention Your Educational Background then press
                              'enter' on your keyboard
                            </label>
                            <TagsInput
                              value={education}
                              onChange={setEducation}
                              required
                              style={{ background: "black !important" }}
                              name="education"
                              placeHolder="Qualifications"
                            />
                            <BtnContainer>
                              <button onClick={() => setUserLogin(true)}>
                                Back
                              </button>
                              <button onClick={() => setFirstPage(false)}>
                                Next page
                              </button>
                            </BtnContainer>
                          </ProfileContainer>
                        ) : (
                          //gig form
                          <GigContainer>
                            <h2>Your Service</h2>
                            <label>Upload Your Gig Picture</label>
                            {gigImg ? (
                              <FormImg>
                                <img
                                  src={`https://gateway.ipfscdn.io/ipfs/${gigImg}`}
                                  alt="skill swap user profile"
                                />
                              </FormImg>
                            ) : (
                              <div></div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              // required
                              onChange={(event) =>
                                uploadToIPFS(event, "setGigImg")
                              }
                            />
                            <label>
                              Upload Your Portfolio Pictures (max 5 images)
                            </label>
                            {portfolioImgs !== undefined &&
                            portfolioImgs.length !== 0 ? (
                              <PortImgContainer>
                                {portfolioImgs.map((portImgs, id) => (
                                  <FormPortImg key={id}>
                                    <img
                                      src={`https://gateway.ipfscdn.io/ipfs/${portImgs}`}
                                      alt="skill swap user profile"
                                    />
                                  </FormPortImg>
                                ))}
                              </PortImgContainer>
                            ) : (
                              <div></div>
                            )}
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              // required
                              onChange={(event) => uploadPortfolioToIPFS(event)}
                            />
                            <label>
                              Set Your Gig Title In Under 70 Characters
                            </label>
                            <input
                              type="text"
                              maxLength="70"
                              placeholder="Title"
                              required
                              spellCheck="true"
                              defaultValue={gigHead}
                              onChange={(e) => setGigHead(e.target.value)}
                            />
                            <label>Describe Your Service</label>
                            <textarea
                              name="gigDes"
                              cols="30"
                              rows="10"
                              placeholder="Gig Description"
                              required
                              spellCheck="true"
                              defaultValue={gigDescrip}
                              onChange={(e) => setGigDescrip(e.target.value)}
                            ></textarea>
                            <label>Set The Category</label>
                            <select
                              name="gig category"
                              onChange={(e) => setGigCategory(e.target.value)}
                              defaultValue={gigCategory}
                              required
                            >
                              <option value="">Category...</option>
                              <option value="Artist">Artist</option>
                              <option value="Art director">Art director</option>
                              <option value="Project manager">
                                Project Manager
                              </option>
                              <option value="NFT specialist / Adviser">
                                NFT Specialist / Adviser
                              </option>
                              <option value="Collabs Manager">
                                Collabs Manager
                              </option>
                              <option value="Influencer">Influencer</option>
                              <option value="Discord Moderator">
                                Discord Moderator
                              </option>
                              <option value="Developer">Developer</option>
                              <option value="Community Manager">
                                Community Manager
                              </option>
                              <option value="Social Media Manager">
                                Social Media Manager
                              </option>
                              <option value="Social Content Creator">
                                Social Content Creator
                              </option>
                              <option value="Meme Creator">Meme Creator</option>
                              <option value="NFT Animator">NFT Animator</option>
                              <option value="Web UI/UX Designer">
                                Web UI/UX Designer
                              </option>
                              <option value="Discord Server Specialist">
                                Discord Server Specialist
                              </option>
                              <option value="NFT Generators">
                                NFT Generators
                              </option>
                              <option value="Alpha Hunter">Alpha Hunter</option>
                              <option value="Writing and Translation">
                                Writing and Translation
                              </option>
                              <option value="Scam Consultant">
                                Scam Consultant
                              </option>
                            </select>

                            <WarningTxt style={{ marginTop: "40px" }}>
                              <span>PAY ATTENTION: </span>The best payment
                              option for your gig depends on your individual
                              needs. Fixed Weekly payments are best for
                              short-term gigs that require regular payments.
                              Fixed Monthly payments are best for long-term
                              projects that require regular payments. Fixed
                              Price is best for one-time projects. Bear Market
                              Price is best for gigs that require flexibility in
                              pricing, allowing for changes depending on the
                              market and also a good way to offer Discounts.
                              Bull Market Price is best for gigs that require
                              higher prices when the market is up. Set As Free
                              Service is for people that want to build up
                              experience in this space before they offer
                              services for a fee.
                            </WarningTxt>

                            <label>Set Fixed Price In USD</label>
                            <input
                              type="number"
                              placeholder="Fixed Price In USD"
                              className="noscroll"
                              spellCheck="true"
                              defaultValue={fixedPrice}
                              onChange={(e) => setFixedPrice(e.target.value)}
                              required
                            />

                            <label htmlFor="isFree" style={{ fontSize: 18 }}>
                              Set As Free Service
                            </label>
                            <input
                              type="text"
                              maxLength="70"
                              placeholder="Free Service"
                              value={isPriceFree}
                              onChange={(e) => setIsPriceFree(e.target.value)}
                            />

                            <label>
                              Set Fixed Weekly Payment In USD (optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Fixed Weekly Payment In USD"
                              className="noscroll"
                              spellCheck="true"
                              defaultValue={weeklyPrice}
                              onChange={(e) => setWeeklyPrice(e.target.value)}
                            />
                            <label>
                              Set Fixed Monthly Payment In USD (optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Fixed Monthly Payment In USD"
                              className="noscroll"
                              spellCheck="true"
                              defaultValue={monthlyPrice}
                              onChange={(e) => setMonthlyPrice(e.target.value)}
                            />

                            <label>
                              Set Bear Market Price In USD (optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Bear Market In USD"
                              className="noscroll"
                              spellCheck="true"
                              defaultValue={gigPrice}
                              onChange={(e) => setGigPrice(e.target.value)}
                            />
                            <label>
                              Set Bull Market Price In USD (optional)
                            </label>
                            <input
                              type="number"
                              placeholder="Bull Market In USD"
                              className="noscroll"
                              spellCheck="true"
                              defaultValue={gigBullPrice}
                              onChange={(e) => setGigBullPrice(e.target.value)}
                            />
                            <label>
                              Set The Keywords To Help Buyer Find Your Gig
                            </label>

                            <TagsInput
                              value={gigKeywords}
                              onChange={setGigKeywords}
                              required
                              style={{ background: "black !important" }}
                              name="keywords"
                              placeHolder="Keywords"
                            />
                            <BtnContainer>
                              <TogglePage onClick={() => setFirstPage(true)}>
                                Previous page
                              </TogglePage>
                              <SubmitBtn type="submit">
                                {editButton ? "Save changes" : "Submit"}
                              </SubmitBtn>
                            </BtnContainer>
                          </GigContainer>
                        )}
                      </form>
                    </div>
                  )}
                  {selectUser === "client" && (
                    <div>
                      <form
                        onSubmit={
                          editButton ? saveBuyerChanges : makeBuyerAccount
                        }
                      >
                        <ProfileContainer>
                          <h2>About Yourself</h2>
                          <WarningTxt>
                            <span>WARNING:</span> Any changes/ edits to a user
                            profile will cost gas fees, as the data is stored on
                            the blockchain. We encourage you to create your
                            account and fill out all necessary information in
                            one go to avoid any unnecessary gas fees. Thank you
                            for your cooperation.
                          </WarningTxt>
                          <label>Name</label>
                          <input
                            type="text"
                            placeholder="Full name"
                            required
                            value={name}
                            spellCheck="true"
                            onChange={(e) => setName(e.target.value)}
                          />
                          <label>
                            Upload Profile Pic (max upload size 5 MB: 1000 x
                            1000 px)
                          </label>
                          {img ? (
                            <FormImg>
                              <img
                                src={`https://gateway.ipfscdn.io/ipfs/${img}`}
                                alt="skill swap user profile"
                              />
                            </FormImg>
                          ) : (
                            <div></div>
                          )}
                          <input
                            type="file"
                            // required
                            accept="image/*"
                            onChange={(event) => uploadToIPFS(event, "setImg")}
                          />
                          <label>One Sentence Bio</label>
                          <input
                            type="text"
                            required
                            spellCheck="true"
                            placeholder="One Sentence Bio"
                            maxLength="100"
                            value={profileTitle}
                            onChange={(e) => setProfileTitle(e.target.value)}
                          />
                          <label>Location</label>
                          <select
                            name="country"
                            onChange={(e) => setCountry(e.target.value)}
                            defaultValue={country}
                            required
                          >
                            <option value="">Location...</option>
                            {countriesData.map((data, idx) => (
                              <option key={idx} value={data.code}>
                                {data.name}
                              </option>
                            ))}
                          </select>
                          <label>Describe Yourself / Project / Company</label>
                          <textarea
                            name="description"
                            cols="30"
                            rows="10"
                            spellCheck="true"
                            placeholder="Something about yourself / project / company"
                            required
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          ></textarea>
                          <label>Your Website Link</label>
                          <input
                            type="url"
                            placeholder="Website Link"
                            spellCheck="true"
                            value={urlS}
                            onChange={(e) => setUrl(e.target.value)}
                          />
                          <label>Your Twitter Handle</label>
                          <input
                            type="text"
                            placeholder="@something"
                            spellCheck="true"
                            value={twitterLink}
                            onChange={(e) => setTwitterLink(e.target.value)}
                          />
                          <label>Your Phone Number</label>
                          <input
                            type="number"
                            placeholder="Phone Number"
                            className="noscroll"
                            spellCheck="true"
                            defaultValue={phoneNo}
                            onChange={(e) => setPhoneNo(e.target.value)}
                          />
                          <label>Your E-mail Address</label>
                          <input
                            type="email"
                            placeholder="E-mail Address"
                            spellCheck="true"
                            value={emailAdd}
                            onChange={(e) => setEmailAdd(e.target.value)}
                          />
                          <BtnContainer>
                            <SubmitBtn type="submit">
                              {editButton ? "Save changes" : "Submit"}
                            </SubmitBtn>
                          </BtnContainer>
                        </ProfileContainer>
                      </form>
                    </div>
                  )}
                </div>
              ) : (
                <SelectUser>
                  <SelectUserContainer>
                    <h3>
                      Thank you for making an account on SkillSwap. Before we
                      proceed, please let us know if you are a freelancer
                      looking for work or a project/founder looking for
                      freelancers.
                    </h3>
                    <SelectUserContent>
                      <div
                        onClick={() => setSelectUser("freelancer")}
                        style={{
                          background: `${
                            selectUser === "freelancer"
                              ? `var(--primary)`
                              : "transparent"
                          } `,
                        }}
                      >
                        I am a freelancer!
                      </div>
                      <div
                        onClick={() => setSelectUser("client")}
                        style={{
                          background: `${
                            selectUser === "client"
                              ? `var(--primary)`
                              : "transparent"
                          } `,
                        }}
                      >
                        Project/ founder
                      </div>
                    </SelectUserContent>
                    {selectUser !== "" && (
                      <SelectUserBtn>
                        <button onClick={() => setIsUserSelected(true)}>
                          Continue
                        </button>
                      </SelectUserBtn>
                    )}
                  </SelectUserContainer>
                </SelectUser>
              )}
            </div>
          )}
        </Container>
      )}
    </Wrapper>
  );
}

export default Selling;

const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  color: white;
  padding-top: 72px;
  background: var(--black);
`;

const Container = styled.div`
  display: flex;
  width: 98%;
  max-width: 1347px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0 auto;
  padding: 40px 0;
  overflow-x: hidden;
  h2 {
    font-size: 40px;
  }
  input,
  textarea,
  select {
    width: 95%;
    max-width: 866px;
    font-size: 16px;
    padding: 10px;
    border-radius: 7px;
    outline: none;
    border: 0;
    @media (max-width: 747px) {
      width: 90%;
    }
  }
  label {
    margin-top: 30px;
    margin-bottom: 10px;
  }
  form {
    width: 100%;
    button {
      width: 30%;
      margin: 10px 0;
      padding: 7px 20px;
      cursor: pointer;
    }
  }
  .gridOneColumn {
    grid-template-columns: auto;
  }
`;

const ProfileContent = styled.div`
  display: grid;
  grid-template-columns: 30% auto;
  grid-gap: 20px;
  @media (max-width: 995px) {
    grid-template-columns: auto;
    width: 100%;
  }

  .noShowProfile {
    @media (max-width: 995px) {
      display: none;
    }
  }
  .noBack {
    display: none;
    @media (max-width: 995px) {
      display: block;
    }
  }
  .fullWidth {
    width: 95%;
    transition: width 0.3s linear;
  }
  .halfWidth {
    top: 5px;
    width: 10px;
    height: 98%;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    transition: width 0.3s linear;
  }
  .noDisplay {
    display: none;
  }
  .noSidebar {
    display: none;
    @media (max-width: 995px) {
      display: flex;
    }
  }
`;

const ProfileBuyerContent = styled.div`
  width: 98%;
  background: var(--darkBg);
  border-radius: 10px;
  border: 1px solid var(--line);
  padding: 10px;
  img {
    width: 70%;
  }
`;

const ProfileContainer = styled.div`
  display: flex;
  border: 1px solid var(--gray);
  text-align: start;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  padding: 40px;
  border-radius: 10px;
  background: var(--darkBg);
  .rti--tag {
    background: #636363 !important;
  }
  @media (max-width: 747px) {
    width: 97%;
    padding: 40px 0;
    background: transparent;
    border: 0;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

const GigContainer = styled.div`
  border: 1px solid var(--gray);
  display: flex;
  text-align: start;
  flex-direction: column;
  width: 80%;
  margin: 0 auto;
  padding: 40px;
  border-radius: 10px;
  background: var(--darkBg);
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
  .rti--tag {
    background: #636363 !important;
  }
  input[type="checkbox"] {
    width: 6%;
  }
  @media (max-width: 747px) {
    width: 97%;
    padding: 40px 0;
    background: transparent;
    border: 0;
  }
`;

const YourDetail = styled.div`
  background: var(--darkBg);
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;
  border: 1px solid var(--line);
  padding: 10px;
  transition: width 0.3s ease;
  align-self: flex-start;
`;

const PPContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
  border-radius: 10px;
  img {
    width: 80%;
    border-radius: 10px;
    box-shadow: 0.6px 2px 3px black;
    align-self: flex-start;
  }
  @media (max-width: 995px) {
    width: 90%;
    justify-content: start;
  }
  @media (max-width: 970px) {
    grid-row: 1/3;
    grid-column: 1/2;
    margin: 0;
    justify-content: start;
    img {
      width: 100%;
      padding: 10px;
    }
  }
  @media (max-width: 575px) {
    grid-row: auto;
    grid-column: auto;
    border-radius: 10px;
    img {
      border-radius: 10px;
    }
  }
  @media (max-width: 375px) {
    width: 90%;
  }
`;

const YourName = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-direction: column;
  padding: 20px 10px;
  margin: 0 auto;
  width: 95%;
  .css-1c99szj-MuiRating-icon {
    color: var(--darkText);
  }
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
  h3 {
    font-size: 22px;
  }
  svg {
    width: 22px;
    height: 22px;
  }
  button {
    padding: 7px 20px;
    border-radius: 10px;
    font-size: 16px;
    background: var(--primary);
    border: 2px solid var(--primary);
    cursor: pointer;
    &:hover {
      background: transparent;
      transition: all 0.3s;
      color: white;
    }
  }
`;

const YourOthers = styled.div`
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  width: 95%;
  margin: 0 auto;
  padding: 20px 0;
  ul {
    width: 100%;
    display: grid;
    grid-template-columns: auto;
    grid-gap: 20px;
    padding: 0 10px;
    li {
      word-wrap: break-word;
      list-style: none;
      display: flex;
      align-items: center;
      a {
        color: var(--link);
        text-overflow: ellipsis;
        overflow: hidden;
        width: 160px;
        height: 1.2em;
        white-space: nowrap;
        margin-left: 7px;
      }
    }
  }
  svg {
    width: 20px;
    height: 20px;
    fill: "#5fd3f3";
  }
  @media (max-width: 970px) {
    grid-row: 2/3;
    grid-column: 2/3;
    width: 100%;
  }
  @media (max-width: 575px) {
    grid-row: auto;
    grid-column: auto;
  }
  @media (max-width: 375px) {
    width: 90%;
  }
`;

const YourDes = styled.div`
  padding: 20px 10px;
  padding-right: 20px;
  p {
    font-size: 16px;
    margin: 10px 0;
    word-wrap: break-word;
    white-space: pre-line;
  }
  span {
    font-size: 17px;
    color: var(--darkText);
  }
  @media (max-width: 375px) {
    width: 90%;
  }
`;

const YourService = styled.div`
  display: grid;
  grid-template-columns: 60% auto;
  height: fit-content;
  grid-gap: 20px;
  width: 99%;
  @media (max-width: 625px) {
    grid-template-columns: auto;
  }
`;

const ServiceHead = styled.div`
  grid-column: 1/3;
  height: fit-content;
  padding: 20px;
  border: 1px solid var(--line);
  background: var(--darkBg);
  border-radius: 10px;
  h2 {
    font-size: 28px;
    margin-bottom: 10px;
  }
`;

const Offer = styled.div`
  height: fit-content;
  grid-column: 2/3;
  padding: 20px;
  border: 1px solid var(--line);
  background: var(--darkBg);
  border-radius: 10px;
  h4 {
    font-size: 20px;
    margin-top: 10px;
  }
  span {
    font-size: 16px;
    color: var(--darkText);
    font-weight: 500;
  }
  p {
    margin-top: 10px;
    font-size: 18px;
    white-space: pre-line;
  }
  @media (max-width: 625px) {
    grid-column: 1/3;
  }
`;

const ServiceDes = styled.div`
  grid-column: 1/2;
  grid-row: 2/3;
  padding: 20px;
  border: 1px solid var(--line);
  background: var(--darkBg);
  border-radius: 10px;
  height: fit-content;
  span {
    color: var(--darkText);
  }
  p {
    margin-top: 10px;
    font-size: 16px;
    white-space: pre-line;
  }
  @media (max-width: 625px) {
    grid-column: 1/3;
    grid-row: 3/4;
  }
`;

const PortfolioCarousel = styled.div`
  grid-column: 1/2;
  grid-row: 3/4;
  padding: 20px;
  border: 1px solid var(--line);
  background: var(--darkBg);
  border-radius: 10px;
  height: fit-content;
  span {
    color: var(--darkText);
    margin-bottom: 20px !important;
  }
  @media (max-width: 625px) {
    grid-column: 1/3;
    grid-row: 4/5;
  }
  .thumbs-wrapper {
    @media (max-width: 625px) {
      display: none;
    }
  }
  .carousel-root {
    margin-top: 10px;
  }
`;

const ServiceImg = styled.div`
  min-height: 70vh;
  img {
    width: 100%;
  }
  @media (max-width: 724px) {
    height: 50vh;
    min-height: auto;
    object-fit: contain;
  }
  @media (max-width: 546px) {
    height: 40vh;
  }
  @media (max-width: 446px) {
    height: 30vh;
  }
`;

const YourSkills = styled.div`
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  width: 95%;
  margin: 0 auto;
  padding: 20px 0;
  div {
    display: flex;
  }
  svg {
    width: 30px;
    height: 30px;
    fill: "#5fd3f3" !important;
  }
`;

const YourEducation = styled.div`
  width: 95%;
  margin: 0 auto;
  padding: 20px 0;
  div {
    display: flex;
  }
  svg {
    width: 30px;
    height: 30px;
    color: "#5fd3f3" !important;
  }
`;

const SubmitBtn = styled.button`
  background: var(--primary);
  border: 0;
  outline: 0;
`;

const TogglePage = styled.button``;

const BtnContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FormImg = styled.div`
  img {
    width: 50%;
  }
`;

const PortImgContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: start;
  flex-wrap: wrap;
  img {
    width: 100%;
  }
`;

const FormPortImg = styled.div`
  width: 18%;
  margin: 10px;
`;

const WarningTxt = styled.p`
  margin: 10px 0;
  color: #5fd3f3;
  border: 2px solid var(--gray);
  padding: 20px;
  span {
    color: white;
  }
`;

const SelectUser = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  min-height: 80vh;
`;

const SelectUserBtn = styled.div`
  margin-top: 20px;
  button {
    padding: 10px 40px;
    font-size: 18px;
    cursor: pointer;
    background: transparent;
    border: 2px solid white;
    color: white;
    &:hover {
      transition: all 0.3s;
      background-color: white;
      color: black;
    }
  }
`;

const SelectUserContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: 700px;
  margin: auto;
  padding: 30px;
  border: 1px solid var(--line);
  border-radius: 5px;
  background: var(--darkBg);
  h3 {
    word-wrap: break-word;
    text-align: center;
    font-weight: 500;
    margin-bottom: 30px;
  }
`;

const SelectUserContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    border: 1px solid var(--primary);
    padding: 20px 40px;
    margin: 10px;
    transition: all 0.3s;
    cursor: pointer;
    text-align: center;
    &:hover {
      transition: all 0.3s;
      background: var(--primary) !important;
    }
    @media (max-width: 662px) {
      width: 150px;
    }
  }
  @media (max-width: 662px) {
    flex-direction: column;
  }
`;

const CloseBtn = styled.div`
  float: right;
  width: 10px;
  height: 100%;
  margin-left: 10px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  background: var(--darkBg);
  border: 1px solid var(--line);
`;

const BuyerDetail = styled.div`
  transition: width 0.3s ease;
  width: 50%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto auto;
  grid-gap: 20px;
  @media (max-width: 1300px) {
    width: 70%;
  }
  @media (max-width: 1200px) {
    width: 80%;
  }
  @media (max-width: 970px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto auto auto;
    width: 98%;
  }
  .buyerPic {
    grid-column: 1/2;
    grid-row: 1/2;
    justify-content: start;
    padding-left: 20px;
    @media (max-width: 960px) {
      padding-left: 0;
    }
    @media (max-width: 970px) {
      grid-column: 1/2;
      grid-row: 1/2;
    }
    img {
      width: 100%;
      @media (max-width: 960px) {
        width: 98%;
      }
    }
  }
  .buyerName {
    grid-column: 1/3;
    grid-row: 2/3;
    padding-top: 0;
    padding-bottom: 0;
    @media (max-width: 970px) {
      grid-column: 1/2;
      grid-row: 2/3;
    }
  }
  .buyerDes {
    grid-column: 1/3;
    grid-row: 3/4;
    margin: 0;
    border: 1px solid var(--line);
    padding-top: 0;
    padding-bottom: 0;
    padding: 10px;
    @media (max-width: 970px) {
      grid-column: 1/2;
      grid-row: 4/5;
    }
  }
  .buyerOthers {
    grid-column: 2/3;
    grid-row: 1/2;
    align-self: center;
    border: 0;
    @media (max-width: 970px) {
      grid-column: 1/2;
      grid-row: 3/4;
      border-top: 1px solid var(--line);
    }
  }
`;

const PortImgModal = styled.div`
  background: var(--darkBg);
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  /* padding-top: 30px; */
  justify-content: center;
  @media (max-width: 1131px) {
    padding-top: 100px;
  }
  @media (max-width: 960px) {
    padding-top: 60px;
  }
  .portImg {
    width: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 50px;
    @media (max-width: 1131px) {
      width: 60%;
    }
    @media (max-width: 411px) {
      width: 80%;
    }
  }
  .portImgContainer {
    width: 90%;
    @media (max-width: 1131px) {
      width: 100%;
    }
  }
  img {
    width: 100%;
  }

  .closeModal {
    position: relative;
    top: 0;
    left: 0;
    width: fit-content;
    cursor: pointer;
    font-size: 30px;
    float: right;
  }
`;

const Review = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 30px 0;
  grid-column: 1/2;
  border: 1px solid var(--line);
  background: var(--darkBg);
  border-radius: 10px;
  span {
    align-self: flex-start;
    margin-left: 20px;
    color: var(--darkText);
  }
  .reviewContent {
    width: 90%;
    margin: 10px auto;
    border-top: 1px solid var(--line);
    padding: 20px 0;
  }
  .by {
    font-size: 14px;
    color: var(--darkText);
    word-break: break-all;
    margin: 10px 0;
  }
  .stars {
    display: flex;
    align-items: center;
    justify-content: start;
    padding: 0;
    margin: 10px 0;
  }
  .MuiRating-icon {
    margin-left: 0 !important;
  }
  .MuiRating-root span {
    padding: 0 !important;
    margin: 0 !important;
    margin-right: 10px !important;
  }

  @media (max-width: 625px) {
    grid-column: 1/3;
  }
`;
