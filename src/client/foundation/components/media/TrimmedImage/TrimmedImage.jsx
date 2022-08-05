import React from "react";

import { createCdnSrc } from "../../../utils";

/**
 * アスペクト比を維持したまま、要素のコンテンツボックス全体を埋めるように拡大縮小したサイズを返す
 */
export const TrimmedImage = ({ height, loading = "lazy", src, width }) => {
  return (
    <img
      height
      width
      loading={loading}
      src={createCdnSrc(src, { fit: "cover", h: height, w: width })}
      style={{ height, width }}
    />
  );
};
