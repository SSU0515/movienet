import React from "react";
import styled from "styled-components";

const TvContainer = styled.div`
  width: 100%;
  height: 100vh;
  background: #eee;
`;

const Ready = styled.div`
  width: 100%;
  height: 100vh;
  background: url("https://cdn.imweb.me/upload/S201909098f3f3450a37c6/2af55cf9c11a0.png")
    center no-repeat;
  display: flex;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 18px;
    font-weight: bold;
    color: ${(props) => props.theme.red};
  }
`;

const Tv = () => {
  return (
    <TvContainer>
      <Ready />
    </TvContainer>
  );
};

export default Tv;
