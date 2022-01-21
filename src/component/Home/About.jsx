import React from "react";
import styled from "styled-components";
import { aboutData } from "../../assets/about";
import blob1 from "../../images/blob1.svg";
import blob2 from "../../images/blob2.svg";
import blob3 from "../../images/blob3.svg";
import blob4 from "../../images/blob4.svg";

function About() {
  return (
    <Wrapper>
      <Container>
        <Head>
          <h1>Why SkillSwap</h1>
          <h5>
            SkillSwap allows people to work from anywhere in the world without
            having to rely on a centralized organization for their work. This
            makes it easier for people to find work and get paid, as well as
            giving them more control and flexibility over how, when, and where
            they work.
          </h5>
        </Head>
        <Content>
          {aboutData.map((data, idx) => (
            <Card key={idx}>
              <h3>{data.head}</h3>
              <p>
                <span>{data.text}</span>
              </p>
            </Card>
          ))}
        </Content>
        <Blob>
          <BlobSvg
            src={blob1}
            className="blob1"
            alt="skillswap - skill swap hero section"
          />
          <BlobSvg
            src={blob2}
            className="blob2"
            alt="skillswap - skill swap hero section"
          />
          <BlobSvg
            src={blob3}
            className="blob3"
            alt="skillswap - skill swap hero section"
          />
        </Blob>
      </Container>
    </Wrapper>
  );
}

export default About;

const Wrapper = styled.section`
  width: 100%;
  background: var(--black);
  padding-top: 100px;
`;
const Container = styled.section`
  width: 90%;
  max-width: 1147px;
  margin: 0 auto;
  padding: 40px 0;
  h1 {
    font-size: 50px;
    font-weight: 900;
    z-index: 999;
  }
  h5 {
    z-index: 999;
    font-size: 18px;
    font-weight: 100;
  }
`;

const Content = styled.section`
  display: grid;
  grid-template-columns: auto auto auto;
  grid-gap: 20px;
  padding: 50px 0;
  position: relative;
  z-index: 999;
  @media (max-width: 990px) {
    grid-template-columns: auto;
    padding-top: 20px;
  }
`;

const Card = styled.section`
  min-height: 20vh;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  z-index: 999;
  background-color: #1a1a1c84;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  border: 1px solid var(--gray);
  h3 {
    color: var(--primary);
    margin-bottom: 13px;
  }
  span {
    font-size: 14px;
  }
  @media (max-width: 990px) {
    width: 90%;
    max-width: 495px;
    margin: 0 auto;
  }
`;

const Head = styled.section`
  z-index: 9999;
  min-height: 20vh;
  text-align: center;
  padding: 20px;
  border-radius: 10px;
  z-index: 999;
  position: relative;
  background-color: #1a1a1c84;
  box-shadow: 0 0 1rem 0 rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 338px;
  margin: 0 auto;
  border: 1px solid var(--gray);
  @media (max-width: 990px) {
    width: 90%;
    max-width: 495px;
    margin: 0 auto;
  }
  h1 {
    color: var(--primary);
    margin-bottom: 13px;
    font-size: 20px;
  }
  h5 {
    font-size: 14px;
  }
`;

const Blob = styled.section`
  .blob1 {
    width: 30%;
    position: absolute;
    top: 4100px;
    left: 40px;
    z-index: 10;
    @media (max-width: 1246px) {
      top: 3600px;
    }
    @media (max-width: 1056px) {
      top: 3700px;
      width: 37%;
    }
    @media (max-width: 997px) {
      top: 4100px;
      left: 130px;
    }
    @media (max-width: 900px) {
      top: 4600px;
    }
    @media (max-width: 730px) {
      top: 4800px;
    }
    @media (max-width: 670px) {
      top: 5300px;
    }
    @media (max-width: 460px) {
      display: none;
    }
  }
  .blob2 {
    width: 40%;
    position: absolute;
    top: 3940px;
    left: 24%;
    z-index: 1;
    @media (max-width: 1246px) {
      top: 3300px;
      width: 48%;
    }
    @media (max-width: 1056px) {
      top: 3500px;
    }
    @media (max-width: 997px) {
      top: 4300px;
      width: 48%;
    }
    @media (max-width: 900px) {
      top: 4500px;
    }
    @media (max-width: 730px) {
      top: 5000px;
    }
    @media (max-width: 670px) {
      top: 5400px;
    }
    @media (max-width: 460px) {
      display: none;
    }
  }
  .blob3 {
    width: 36%;
    position: absolute;
    top: 4090px;
    left: 50%;
    z-index: 1;
    @media (max-width: 1246px) {
      top: 3500px;
    }
    @media (max-width: 1056px) {
      top: 3700px;
      width: 42%;
    }
    @media (max-width: 997px) {
      top: 4000px;
      width: 42%;
    }
    @media (max-width: 900px) {
      top: 4200px;
    }
    @media (max-width: 730px) {
      top: 4900px;
    }
    @media (max-width: 670px) {
      top: 5700px;
    }
    @media (max-width: 460px) {
      display: none;
    }
  }
`;

const BlobSvg = styled.img`
  position: absolute;
  z-index: 3;
  width: 400px;
`;
