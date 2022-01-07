import "./App.css";
import styled from "styled-components";
import Navbar from "./component/Navbar";
import Home from "./pages/Home";
import Foot from "./component/Foot";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Selling from "./pages/Selling";
import { ChainId, ThirdwebProvider } from "@thirdweb-dev/react";
import Buying from "./pages/Buying";
import { useState, useEffect } from "react";
import { categoryData } from "./assets/category";
import ScrollToTop from "./ScrollToTop";
import SellerProfile from "./pages/SellerProfile";
import Chat from "./pages/Chat";
import Order from "./pages/Order";
import Gig from "./pages/Gig";
import Buyer from "./pages/Buyer";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import TOS from "./pages/TOS";

const styleAlert = {
  width: "70%",
  margin: "0 auto",
  marginBottom: "30px",
  position: "fixed",
  top: "80px",
  left: "15%",
  zIndex: 99999,
  backgroundColor: "#000000",
  color: "white",
};

function App() {
  const activeChainId = ChainId.Mainnet;
  const [searchData, setSearchData] = useState("");
  const [sellerData, setSellerData] = useState("");
  const [changeSearch, setChangeSearch] = useState("");
  const [showAlert, setShowAlert] = useState([]);

  useEffect(() => {
    setChangeSearch(localStorage.getItem("searchReq"));
    // eslint - disable - next - line;
  }, [searchData]);

  return (
    <Router>
      <Wrapper>
        {showAlert.length !== 0 &&
          showAlert.map((alertData, id) =>
            alertData.isNotMsg === false ? (
              <div key={id}>
                {" "}
                <Stack sx={styleAlert} spacing={2}>
                  {alertData.isErr === true ? (
                    <Alert severity="error">{alertData.msg}</Alert>
                  ) : (
                    <Alert severity="success">{alertData.msg}</Alert>
                  )}
                </Stack>
              </div>
            ) : (
              <div></div>
            )
          )}
        <Navbar searchState={setSearchData} />
        <ScrollToTop />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route
            exact
            path="/chat"
            element={<Chat setDisplayAlert={setShowAlert} />}
          />
          <Route
            exact
            path={"/chat/"}
            element={
              <Chat
                chatSellerId={localStorage.getItem("sellerId")}
                setDisplayAlert={setShowAlert}
              />
            }
          />
          <Route
            exact
            path={changeSearch}
            element={
              <Buying category={changeSearch} sellerState={setSellerData} />
            }
          />
          {categoryData.map((data, idx) => (
            <Route
              exact
              path={data.link}
              element={
                <Buying
                  key={idx}
                  category={data.link}
                  sellerState={setSellerData}
                />
              }
            />
          ))}
          <Route
            exact
            path={
              localStorage.getItem("sellerId") === undefined
                ? ""
                : "/seller/" + localStorage.getItem("sellerId")?.slice(2)
            }
            element={
              <SellerProfile
                setSellerState={localStorage.getItem("sellerId")}
                setDisplayAlert={setShowAlert}
              />
            }
          />
          <Route
            exact
            path={
              localStorage.getItem("sellerId") === undefined
                ? ""
                : "/contractor/" + localStorage.getItem("sellerId")?.slice(2)
            }
            element={
              <SellerProfile
                setSellerState={localStorage.getItem("sellerId")}
                setDisplayAlert={setShowAlert}
              />
            }
          />
          <Route
            exact
            path="/order"
            element={<Order setDisplayAlert={setShowAlert} />}
          />
          <Route
            exact
            path="/gigs"
            element={<Gig sellerState={setSellerData} />}
          />
          <Route
            exact
            path="/contractors"
            element={<Buyer sellerState={setSellerData} />}
          />
          <Route exact path="/tos" element={<TOS />} />

          <Route
            exact
            path="/myprofile"
            element={
              <ThirdwebProvider activeChain={activeChainId}>
                <Selling setDisplayAlert={setShowAlert} />
              </ThirdwebProvider>
            }
          />
        </Routes>
        <Foot />
      </Wrapper>
    </Router>
  );
}

export default App;

const Wrapper = styled.section`
  width: 100%;
  min-height: 100vh;
  background: var(--black);
  color: white;
`;
