import React from "react";
import styled from "styled-components";

import { createCdnSrc } from "../../../../utils";

const Image = styled.img`
  display: block;
  margin: 0 auto;
`;

/**
 * @typedef Props
 * @type {object}
 * @property {string} url
 */

const Spacer = ({ children }) => (
  <div
    style={{
      aspectRatio: "347 / 249",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        maxWidth: 1024,
        width: "auto",
      }}
    >
      {children}
    </div>
  </div>
);

/** @type {React.VFC<Props>} */
export const HeroImage = ({ url }) => {
  if (url === null) {
    return <Spacer />;
  }

  return (
    <Spacer>
      <Image alt="" src={createCdnSrc(url)} />
    </Spacer>
  );
};
