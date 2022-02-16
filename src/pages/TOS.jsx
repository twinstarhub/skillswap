import React from "react";
import styled from "styled-components";
import zaba from "../images/imgSS.png";

function TOS() {
  return (
    <Wrapper>
      <Container>
        <div>
          <img src={zaba} alt="" />
        </div>
        <h1>Terms of Service:</h1>
        <h3>
          These Terms of Service (“Terms”) govern your access to and use of the
          SkillSwap platform. By using the SkillSwap platform, you agree to be
          bound by these Terms, including the policies referenced in these
          Terms. We may modify these Terms at any time in our sole discretion.
          Your continued use of the SkillSwap platform after any such
          modifications will constitute your acceptance of the modified Terms.
        </h3>
        <h5>1. Account and Use</h5>
        <p>
          In order to access and use the SkillSwap platform, you must create an
          account using your ETH wallet address and provide accurate and
          complete information. You are responsible for all activities that
          occur under your account and shall keep your account secure. You are
          solely responsible for any and all activities that occur on or through
          your account.
        </p>

        <Line></Line>
        <h5>2. Fees</h5>

        <p>
          You are responsible for paying any fees associated with your use of
          the SkillSwap platform. Buyers of services are responsible for paying
          the (gas) fees associated with the services and for any applicable
          taxes. Sellers of services are also responsible for paying gas fees
          associated with the services and for any applicable taxes.
        </p>

        <Line></Line>
        <h5>3. Prohibited Activities</h5>

        <p>
          You shall not use the SkillSwap platform or services for any illegal
          or unauthorized purpose, including but not limited to:
        </p>
        <ul>
          <li>
            Posting or transmitting any unlawful, harassing, libelous, abusive,
            threatening, harmful, vulgar, obscene, or otherwise objectionable
            material.
          </li>
          <li>
            Posting or transmitting any material that may infringe upon the
            intellectual property rights of another party.
          </li>
          <li>
            Engaging in any activity that may be deemed to be fraudulent or
            deceptive.
          </li>
          <li>
            Engaging in any activity that is deemed to be in violation of any
            local, state, or federal law.
          </li>
        </ul>

        <Line></Line>
        <h5>4. Termination</h5>

        <p>
          We may immediately terminate or suspend your access to the SkillSwap
          platform and/or services at any time and for any reason, with or
          without notice.
        </p>

        <Line></Line>
        <h5>5. Disclaimer</h5>

        <p>
          THE SKILLSWAP PLATFORM AND SERVICES ARE PROVIDED “AS IS” WITHOUT
          WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT
          LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
          PARTICULAR PURPOSE, OR NON-INFRINGEMENT.
        </p>

        <Line></Line>
        <h5>6. Indemnification</h5>

        <p>
          You agree to indemnify and hold us harmless from any claims, losses,
          liabilities, damages, and expenses, including attorney’s fees, arising
          out of your use of the SkillSwap platform and/or services.
        </p>

        <Line></Line>
        <h5>7. Governing Law</h5>

        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of The High Table and The Nightwalkers DAO that is governing this
          decentralized Web3 platform, without giving effect to any principles
          of conflicts of law.
        </p>

        <Line></Line>
        <h5>8. Contact Us</h5>

        <p>
          If you have any questions or concerns about these Terms, please reach
          out to The Nightwalkers DAO.
        </p>
      </Container>
    </Wrapper>
  );
}

export default TOS;

const Wrapper = styled.section`
  background: var(--black);
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
`;

const Container = styled.section`
  background: var(--darkBg);
  border: 1px solid var(--line);
  width: 90%;
  max-width: 700px;
  margin: 0 auto;
  padding: 40px;
  border-radius: 5px;
  @media (max-width: 794px) {
    max-width: unset;
    width: 80%;
  }
  @media (max-width: 425px) {
    width: 70%;
  }
  div {
    display: flex;
    align-items: center;
    img {
      width: 60%;
      margin: 0 auto;
    }
  }
  h1 {
    font-size: 30px;
    margin: 14px 0;
  }
  h3 {
    font-size: 18px;
    font-weight: 300;
    color: var(--darkText);
  }
  h5 {
    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 14px;
  }
  ul {
    padding-left: 10px;
    margin-top: 10px;
  }
  li {
    margin: 5px 0;
    color: var(--darkText);
  }
  p {
    color: var(--darkText);
  }
`;

const Line = styled.div`
  border-bottom: 2px solid var(--line);
  width: 100%;
  margin: 10px auto;
`;
