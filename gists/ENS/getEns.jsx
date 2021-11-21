//web3
import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import { Web3Provider } from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setDisplayName } from "../../redux/actions/stateActions";
//utils
import useOnClickOutsideRef from "../../utils/customHooks/useOnClickOutsideRef";
import {
  injected,
  walletconnect,
  walletlink,
} from "../../utils/web3/connectors";
import "./WalletBtn.css";
import WalletIcons from "./WalletIcons";
import WalletList from "./WalletList";

const WalletBtn = () => {
  const dispatch = useDispatch();
  // state
  const [showWallets, setShowWallets] = useState(false);
  const [ens, setEns] = useState(null);
  const [ensName, setEnsName] = useState("");

  const { connector, account, active } = useWeb3React();

  const menuRef = useOnClickOutsideRef(
    () => showWallets && setShowWallets(false)
  );

  const getEnsName = async () => {
    try {
      const address = account;
      if (!address) return;
      const ensName = await ens.getName(address);
      if (ensName.name) {
        setEnsName(ensName.name);
        dispatch(setDisplayName(ensName.name));
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const getIcon = () => {
    switch (connector) {
      case injected:
        return "metamask";

      case walletconnect:
        return "walletConnect";

      case walletlink:
        return "walletLink";

      default:
        break;
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      setEns(
        new ENS({
          provider: new Web3Provider(window.ethereum),
          ensAddress: getEnsAddress("1"),
        })
      );
    }
  }, [window.ethereum]);

  useEffect(() => {
    if (ens) {
      getEnsName();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ens, account]);

  return (
    <div>
      <div
        className={`walletBtn ${active ? "walletConnected" : ""}`}
        onClick={() => {
          setShowWallets((prev) => !prev);
        }}
        title={account || "Connect Wallet"}
      >
        {active && WalletIcons[getIcon()]}
        <div>
          {active
            ? ensName || `${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect wallet"}
        </div>

        <div
          className={`walletList ${showWallets ? "" : "walletList__inactive"}`}
          ref={menuRef}
        >
          <WalletList />
        </div>
      </div>
    </div>
  );
};

export default WalletBtn;
