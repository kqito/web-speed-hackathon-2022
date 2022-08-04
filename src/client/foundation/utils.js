const CDN_URL = "https://images.weserv.nl";
const BASE_URL = "https://web-speed-hackathon-2022.herokuapp.com";

export const createCdnSrc = (src, { fit, h, q = 40, w } = {}) => {
  const cdnUrl = new URL(CDN_URL);
  const srcUrl = new URL(src, BASE_URL);
  cdnUrl.searchParams.append("url", srcUrl.toString());

  // options
  cdnUrl.searchParams.append("output", "webp");
  cdnUrl.searchParams.append("q", q);

  if (w) {
    cdnUrl.searchParams.append("w", w);
  }
  if (h) {
    cdnUrl.searchParams.append("h", h);
  }
  if (fit) {
    cdnUrl.searchParams.append("fit", fit);
  }

  const cdnSrc = cdnUrl.toString();

  return cdnSrc;
};
