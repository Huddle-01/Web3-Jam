import axios from "axios";

export const uploadmetadata = async (body) =>
  axios({
    method: "post", // default
    baseURL: "https://api.nftport.xyz/v0/metadata",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: process.env.REACT_APP_NFT_PORT_KEY,
    },
    data: { ...body },
  });

export const customizableMint = async (body) =>
  axios({
    method: "post", // default
    baseURL: "https://api.nftport.xyz/v0/mints/customizable",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
      Authorization: process.env.REACT_APP_NFT_PORT_KEY,
    },
    data: { ...body },
  });
