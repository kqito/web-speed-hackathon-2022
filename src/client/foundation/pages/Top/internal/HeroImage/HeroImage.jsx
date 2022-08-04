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

const Spacer = () => (
  <div
    style={{
      aspectRatio: "347 / 249",
      overflow: "hidden",
    }}
  >
    <div
      style={{
        height: 3099,
        maxWidth: 1024,
        width: 4320,
      }}
    ></div>
  </div>
);

/** @type {React.VFC<Props>} */
export const HeroImage = ({ url }) => {
  if (url === null) {
    return <Spacer />;
  }

  return <Image alt="" src={createCdnSrc(url)} />;
};
