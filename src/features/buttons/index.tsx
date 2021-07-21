import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers, Contract } from 'ethers';
import React, { useEffect, useState } from 'react';
import web3 from 'web3';
import ConnectButton from '../web3/ConnectButton';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AUCTION_ABI = require('./auction.abi.json');
const NFT_ABI = require('./nft.abi.json');
const ERC20_ABI = require('./erc20.abi.json');

const auctionContractAddress = '0xB60a6392b6aa505345792aE7B16b63E6aE6a5329';
const nftAddress = '0x949461294a4c131672d0123ceaa846a11548805d';
const nftAssetID = 1;
const startingPrice = 1000;
const timeInterval = 10000;
const gasPrice = web3.utils.toWei('130', 'gwei');
const gasLimit = 1000000;

function Marketplace() {
  const { library, account } = useWeb3React<Web3Provider>();
  const [auctionContract, setAuctionContract] = useState<Contract>();

  useEffect(() => {
    if (!!library && account) {
      (async () => {
        const signer = await library.getSigner(account);

        const auctionContract = new ethers.Contract(
          auctionContractAddress,
          AUCTION_ABI,
          signer
        );

        setAuctionContract(auctionContract);
      })();
    }
  }, [account, library]);

  const placeOrder = async () => {
    if (!library || !account || !auctionContract) return;

    const signer = await library.getSigner(account);

    /** Create an order */

    // Approve transferring NFT
    const nftContract = new ethers.Contract(nftAddress, NFT_ABI, signer);

    await nftContract.approve(auctionContractAddress, nftAssetID);

    const orderID = await auctionContract.createOrder(
      nftAddress,
      nftAssetID,
      '0xc453409b71c18e1d8a5efee10fa152997ab84374',
      startingPrice,
      timeInterval,
      {
        gasLimit,
        gasPrice,
      }
    );

    console.log('Order ID:', orderID);
  };

  const newBid = async () => {
    if (!library || !account || !auctionContract) return;

    const signer = await library.getSigner(account);
    /** Create a bid */
    // Approve Transfering ERC20 token
    const futureToken = '0xc453409b71c18e1d8a5efee10fa152997ab84374'; // Future Token
    const futureTokenAmount = 3000;
    const tokenContract = new ethers.Contract(futureToken, ERC20_ABI, signer);
    const isApprovedToken = await tokenContract.approve(
      auctionContractAddress,
      futureTokenAmount
    );

    console.log('Approve Status:', isApprovedToken);

    await auctionContract.createBid(
      nftAddress,
      nftAssetID,
      futureToken,
      futureTokenAmount,
      {
        gasLimit,
        gasPrice,
      }
    );
  };

  const acceptBid = async () => {
    if (!auctionContract) return;

    /** Accept the bid */
    await auctionContract.acceptBid(nftAddress, nftAssetID, {
      gasLimit,
      gasPrice,
    });
  };

  return (
    <div>
      <p style={{ marginBottom: '20px' }}>{account && 'Account: ' + account}</p>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <ConnectButton />
        <button onClick={placeOrder}>Place order</button>
        <button onClick={newBid}>New bid</button>
        <button onClick={acceptBid}>Accept bid</button>
      </div>
    </div>
  );
}

export default Marketplace;
