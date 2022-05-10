import { useEffect, useRef, useState } from "react";
import { Input } from "web3uikit";
import './Settings.css';
import { defaultImgs } from "../defaultimgs";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";


const Settings = () => {
  const { Moralis, isAuthenticated, account } = useMoralis();
  const Web3Api = useMoralisWeb3Api();
  const [pfps, setPfps] = useState([]);
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [theFile, setTheFile] = useState();
  const [selectedPfp, setSelectedPfp] = useState();
  const inputFile = useRef();
  const [selectedFile, setSelectedFile] = useState(defaultImgs[1]);

  const changeHandler = (event) => {
    const img = event.target.files[0];
    setTheFile(img);
    setSelectedFile(URL.createObjectURL(img));
  }

  const onBannerClick = () => {
    inputFile.current.click();
  }

  const saveEdits = async () => {
    const User = Moralis.Object.extend("_User");
    const query = new Moralis.Query(User);
    const userDetails = await query.first();

    if (bio) {
      userDetails.set("bio", bio);
    }
    if (selectedPfp) {
      userDetails.set("pfp", selectedPfp);
    }
    if (username) {
      userDetails.set("username", username);
    }
    if (theFile) {
      const data = theFile;
      const file = new Moralis.File(data.name, data);
      await file.saveIPFS();
      userDetails.set("banner", file.ipfs());
    }

    await userDetails.save();
    window.location.reload();
  }

  const resolveLink = (url) => {
    if (!url || !url.includes("ipfs://")) return url;
    return url.replace("ipfs://", "https://gateway.ipfs.io/ipfs");
  }

  useEffect(() => {
    const getNfts = async () => {
      const nftsResult = await Web3Api.account.getNFTs({
        chain: "mumbai",
        address: account,
      });
      const nftImages = nftsResult.result.map((nft) => {
        return resolveLink(JSON.parse(nft.metadata)?.image);
      })
      setPfps(nftImages);
    }

    getNfts();
  }, [isAuthenticated, account])

  return (
    <>
      <div className="pageIdentify">Settings</div>
      <div className="settingsPage">
        <Input
          label="Name"
          name="NameChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Bio"
          name="bioChange"
          width="100%"
          labelBgColor="#141d26"
          onChange={(e) => setBio(e.target.value)}
        />

        <div className="pfp">
          Profile Image (Your NFTs)
          <div className="pfpOptions">
            {
              pfps.map((pfp, pfpKey) => {
                return (
                  <img
                    key={pfpKey}
                    src={pfp}
                    className={selectedPfp === pfp ? "pfpOptionSelected" : "pfpOption"}
                    onClick={() => {
                      setSelectedPfp(pfp);
                    }} />
                )
              })
            }
          </div>
        </div>

        <div className="pfp">
          Profile Banner
          <div className="pfpOptions">
            <img
              src={selectedFile}
              onClick={onBannerClick}
              className="banner"
            />
            <input
              type="file"
              name="file"
              ref={inputFile}
              onChange={changeHandler}
              style={{
                display: "none"
              }}
            />
          </div>
        </div>
        <div
          className="save"
          onClick={() => {
            saveEdits();
          }}
        >
          Save
        </div>
      </div>
    </>
  );
};

export default Settings;

