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

/** @type {React.VFC<Props>} */
export const HeroImage = ({ url }) => {
  return <Image alt="" loading="lazy" src={createCdnSrc(url)} />;
};
