import { Contract } from "@ethersproject/contracts";
import { parseEther } from "@ethersproject/units";

import abi from "./abi";
import Crypto from "crypto";

const contractAddress = "0x14bb3586Ce2946E71B95Fe00Fc73dd30ed830863";

export const lockMeeting = async (
  account,
  library,
  price,
  noOfKeys,
  lockName
) => {
  try {
    const unlockContract = new Contract(contractAddress, abi, library);
    const signer = library.getSigner(account);
    const unlockSigner = unlockContract.connect(signer);

    const tx = await unlockSigner.createLock(
      3153600000,
      "0x0000000000000000000000000000000000000000",
      parseEther(price.toString()),
      noOfKeys,
      lockName,
      "0x" + Crypto.randomBytes(12).toString("hex")
    );

    const waitedResult = await tx.wait();

    const lockAddress = waitedResult.events[0].args.newLockAddress;

    const paywallConfig = {
      pessimistic: true,
      locks: {
        [lockAddress]: {
          network: 137,
          name: "Huddle01 Meeting Lock",
        },
      },
      icon: "https://ipfs.io/ipfs/QmWCq81a9HaosekQT2Fpg1dK3vY9bvJWi8xFpudTbmGB37",
      callToAction: {
        default: "Unlock your room!",
      },
    };

    const url = `https://app.unlock-protocol.com/checkout?paywallConfig=${encodeURIComponent(
      JSON.stringify(paywallConfig)
    )}`;

    return { lockAddress, url };
  } catch (err) {
    console.log("Error ser, creating lock ", err);
    return { err };
  }
};
