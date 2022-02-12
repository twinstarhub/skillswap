import React from "react";
import styled from "styled-components";
import About from "../component/Home/About";
import Category from "../component/Home/Category";
import HeroSec from "../component/Home/HeroSec";
import SellerCount from "../component/Home/SellerCount";

function Home() {
  return (
    <Wrapper>
      <HeroSec />
      <Category />
      <SellerCount />
      <About />
    </Wrapper>
  );
}

export default Home;

const Wrapper = styled.section``;
