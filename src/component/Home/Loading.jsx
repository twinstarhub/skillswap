import React from "react";
import styled from "styled-components";
import { BeatLoader } from "react-spinners";

function Loading() {
  return (
    <Wrapper>
      <Container>
        <BeatLoader color="#5fd3f3" />
      </Container>
    </Wrapper>
  );
}

export default Loading;

const Wrapper = styled.div`
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Container = styled.div`
  margin: auto;
`;
