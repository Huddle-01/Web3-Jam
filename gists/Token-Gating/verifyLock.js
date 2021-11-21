const verifyLock = async () => {
  if (!account) return;
  if (joinStatus === "loading") {
    const roomId = params.get("roomId");

    try {
      const { data } = await axios.get(`${URL}/${roomId}`);

      const contractAddress = data.contractAddress;

      const { data: covalentData } = await axios.get(
        `https://api.covalenthq.com/v1/137/address/${account}/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=true&key=ckey_161a1d04aa894d819f54712a204`
      );

      const assestarr = covalentData.data.items;

      assestarr.forEach((asset) => {
        if (
          asset.contract_address.toLowerCase() === contractAddress.toLowerCase()
        ) {
          state.setItem("tg-userauth", roomId);
          history.push(`/room?roomId=${roomId}`);
        }
      });

      setJoinStatus("denied");
    } catch (err) {
      setJoinStatus("denied");
      console.log(err);
    }
  }
};
