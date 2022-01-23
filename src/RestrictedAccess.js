import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SpecialNFT from './abis/SpecialNFT.json';
import YoutubeVid from './YoutubeVid';
import ButtonExplorer from './ButtonExplorer';
const axios = require('axios');

const NFT_CONTRACT_ADDRESS = "0x076323e0755fd9396db1fe981a7397718c79b096";
const baseURL = "https://deep-index.moralis.io/api/v2/nft";
const API_KEY = process.env.REACT_APP_API_KEY;
const URI_DATA = "ipfs://QmTRi1rUtaa5Bc9Mx4RWiMeQhsrJcfHhDt4kTgDrU2GoDk"
const MINT_PRICE = "0.5";

export default function RestrictedAccess() {
  const { contractName, abi } = SpecialNFT;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, provider);
  
  const [userAddress, setUserAddress] = useState(null);
  const [nftBalance, setNftBalance] = useState(0);
  const [ownersList, setOwnersList] = useState([]);
  const [txReceipt, setTxReceipt] = useState({});
  const [isOwner, setIsOwner] = useState(false);

  const connectWallet = async () => {
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const userAddress = await signer.getAddress();
    setUserAddress(userAddress);
    getBalance();
  }

  const getBalance = async () => {
    if (userAddress) {
      const nftBalance = await contract.balanceOf(userAddress);
       setNftBalance(nftBalance.toString());
    }
  }
  async function getData() {
    if(Number(nftBalance) > 0) {
        const response = await axios.get(`${baseURL}/${NFT_CONTRACT_ADDRESS}/owners?chain=mumbai&format=decimal`, {
          headers: {
            'X-API-Key': API_KEY
          }
        });
        const { data } = await response;
        setOwnersList(data.result);
      
      if(ownersList.length > 0) {
        const result = ownersList.find(owner => userAddress.toLowerCase() === owner.owner_of.toLowerCase());
        console.log(result)
        result ? setIsOwner(true) : setIsOwner(false);
      } else {
        alert('No tienes ningun SpecialNFT');
      }
    }
  }

  useEffect(() => {
    async function accountChange() {
      await window.ethereum.on("accountsChanged", (accounts) => {
        window.location.reload();
      })
    }
    accountChange();
    getBalance();
    getData();
  }, [userAddress])

  async function mintFunction() {
    const signer = provider.getSigner();
    const mint = new ethers.Contract(NFT_CONTRACT_ADDRESS, abi, signer);
    const txResponse = await mint.mintSpecialNFT(URI_DATA, { value: ethers.utils.parseEther(MINT_PRICE)})
    const receipt = await txResponse.wait();
    setTxReceipt(receipt);
    getData();
  }

  return (
    <div style={{marginTop: '35px'}}>
      <h1>{contractName}</h1>
      {
        !userAddress && (
          <div>
            <button onClick={connectWallet}>Conectar Wallet</button>
          </div>
        )
      }
      {
        userAddress && (
          <h5>Connected: {String(userAddress).substring(0, 6)}
          ...
          {String(userAddress).substring(38)}</h5>
        )
      }
      <button onClick={getData}>View Content</button>
      {
        isOwner && (
          <div>
            <YoutubeVid embedId={"crZfT5qnFdA"}/>
          </div>
        )
      }
      {
        (!isOwner && userAddress) && (
          <div>
            <h3>Mintea tu NFT para tener Acceso al contenido...!!</h3>
            <button onClick={mintFunction}>Mintear</button>
          </div>
        )
      }
      {
        txReceipt.transactionHash && (
          <ButtonExplorer txHash={txReceipt.transactionHash} />
        )
      }
      <p>
        <a target="_blank" href="https://faucet.polygon.technology/" rel="noreferrer">Get MATIC Test</a>
      </p>
      <p>
        Hosted by <a target="_blank" href="https://moralis.io/" rel="noreferrer"><b>Moralis.io</b></a>
      </p>
    </div>
  )
}
