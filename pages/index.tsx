import {
  ConnectWallet,
  ThirdwebNftMedia,
  useAddress,
  useContract,
  useContractRead,
  useOwnedNFTs,
  useTokenBalance,
  Web3Button, useMetamask
} from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import NFTCard from "../components/NFTCard";
import {
  nftDropContractAddress,
  stakingContractAddress,
  tokenContractAddress,
} from "../consts/contractAddresses";
import styles from "../styles/Home.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { disconnect } from "process";


const Home: NextPage = () => {
  const address = useAddress();
  const { contract: nftDropContract } = useContract(
    nftDropContractAddress,
    "nft-drop"
  );
  const { contract: tokenContract } = useContract(
    tokenContractAddress,
    "token"
  );
  const { contract, isLoading } = useContract(stakingContractAddress);
  const { data: ownedNfts } = useOwnedNFTs(nftDropContract, address);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const [claimableRewards, setClaimableRewards] = useState<BigNumber>();
  const { data: stakedTokens } = useContractRead(
    contract,
    "getStakeInfo",
    //@ts-ignore
    [address]
  );
  const connectWithMetamask = useMetamask();

  useEffect(() => {
    if (!contract || !address) return;

    async function loadClaimableRewards() {
      if (address && contract) {
        const stakeInfo = await contract.call("getStakeInfo", [address]);
        setClaimableRewards(stakeInfo[1]);
      }
    }

    loadClaimableRewards();
  }, [address, contract]);

  async function stakeNft(tokenId: BigNumber) {
    if (!address) return;
    if (!ethers.BigNumber.isBigNumber(tokenId)) {
     // tokenId = BigNumber.from(tokenId);
    }
  
    const isApproved = await nftDropContract?.isApproved(
      address,
      stakingContractAddress
    );
    if (!isApproved) {
      await nftDropContract?.setApprovalForAll(stakingContractAddress, true);
    }
  
    try {
      await contract?.call("stake", [[tokenId]]);
    } catch (error) {
      console.error('Error staking NFT:', error);
    }
  }

  if (isLoading) {
    return <div className="items-center justify-center w-screen h-screen text-4xl font-extrabold text-center text-white rounded-full mt-60 animate-bounce" >Loading ChadBased...... </div>;
  }

  function claimRewards(contract: any, contractAddress: any) {
    contract
      .call("claimRewards")
      .then(() => {
        toast.success('Rewards claimed successfully');
      })
      .catch((error: any) => {
        toast.error('You have no rewards to claim');
      });
  }

  const handleWalletConnected = () => {
    toast.success('Hoo Welcome To ChadBased!');
  };
  const handleWalletDisconnected = () => {
    toast.success('bye bye');
  };

  return (
    <>
      <div className="text-white bgs " >
        <h1 className="justify-center p-6 text-4xl font-bold text-center text-white " > Stake Your CHAD BASED </h1>

        {!address ? (

          <button
            onClick={address ? () => {
              disconnect();
              handleWalletDisconnected();
            } : () => {
              connectWithMetamask();
              handleWalletConnected();
            }}
            className="bg-[#04030b] flex  mx-auto mt-36 backdrop-filter font-semibold  border-2 border-[#2c1f60] backdrop-blur-lg
               bg-opacity-20 hover:bg-opacity-50 text-[#d8fd08] hover:animate-bounce 2xl:animate-bounce 
               hover:text-[#98b200] hover:border-[#d8fd08]  py-4 px-4 rounded-lg  transition-all 
               duration-300"
          >
            {address ? `Disconnect...... (${address.slice(-4)})` : 'Connect Wallet'}
          </button>
        ) : (
          <>
            <div className='relative p-6 my-6 rounded-lg'>
              <div className='grid grid-cols-1 gap-4 mx-auto sm:grid-cols-2 '>
                <div className='	display: block;
	width: fit-content;
	max-width: 100%;
	text-decoration: none;
	color: var(--bc);
	font-size: 16px;
	text-transform: uppercase;
	font-family: var(--hff);
	border: 2px solid var(--extra-color);
	border-radius: 5px;
	line-height: 46px;
	padding: 0 20px 0 73px;
	position: relative;
	text-align: center;
	letter-spacing: .5px;'>
                  <h3 className='text-[#78f701] animate-pulse text-lg font-medium mb-2 text-center'>Claimable CHADS-XP</h3>
                  <p className='text-lg font-bold text-center text-white'>
                    <b>
                      {!claimableRewards
                        ? "Loading..."
                        : ethers.utils.formatUnits(claimableRewards, 18)}
                    </b>{" "}
                    {tokenBalance?.symbol}
                  </p>
                </div>


              </div>
            </div>

            <button
              className="mx-auto border-2 border-[#2c1f60] bg-opacity justify-center flex items-end -20 rounded-xl
               text-[#78f701] font-bold text-lg px-8 py-2 backdrop-filter 
               backdrop-blur-3xl shadow-lg hover:bg-opacity-30 focus:outline-none focus:ring-2 
               focus:ring-[#98b200]"
              onClick={() => claimRewards(contract, stakingContractAddress)}
            >
              Claim Rewards
            </button>

            <div className="items-center text-center bg-transparent " >
              <div className="items-center justify-center p-4 text-center bg-opacity-10 rounded-2xl mt-7 " >
                <h2 className='text-[#78f701] rounded-md items-center animate-pulse flex bg-opacity-100 
                 w-full text-2xl   border-2 border-x-[9px] border-x-[] border-y-2 border-[#78f701] justify-center p-2 md:text-3xlxl bg-black  h-14 backdrop-blur-xl  
                font-bold mt-4 mx-auto '>Your Staked NFTs</h2>
              </div>
              <div className='flex flex-col items-center justify-center mt-5'>
                <div className='grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-row-3 lg:grid-cols-4'>
                  {stakedTokens?.[0]?.map((stakedToken: BigNumber, index: number) => (
                    <div key={stakedToken.toString()} className={`mx-auto backdrop-blur-xl border-2 border-gray-700 w-64 sm:block sm:h-full align-middle items-center justify-center bg-opacity-10 rounded-xl p-4`}>
                      <NFTCard tokenId={stakedToken.toNumber()} />
                    </div>
                  ))}
                </div>
              </div>

              <div className="items-center text-center bg-transparent " >
                <div className="items-center justify-center p-4 text-center bg-opacity-10 rounded-2xl mt-7 " >
                  <h2 className='text-[#78f701] rounded-md items-center animate-pulse flex bg-opacity-100 
                 w-full text-2xl   border-2 border-x-[9px] border-x-[] border-y-2 border-[#78f701] justify-center p-2 md:text-3xlxl bg-black  h-14 backdrop-blur-xl  
                font-bold mt-4 mx-auto '>Your NFTs</h2>
                </div>
                <div className='flex flex-col items-center justify-center sm:mx-auto sm:items-center'>
                  <div className='grid w-full max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
                    {ownedNfts?.map((nft) => (
                      <div className='items-center justify-center w-64 p-4 mx-auto align-middle bg-opacity-50 border-4 border-white backdrop-blur-xl border-opacity-10 sm:block sm:h-full rounded-xl' key={nft.metadata.id.toString()}>
                        <ThirdwebNftMedia metadata={nft.metadata} />
                        <h3 className='my-2 text-lg font-bold text-white'>{nft.metadata.name}</h3>
                        <Web3Button
                          contractAddress={stakingContractAddress}
action={() => stakeNft(BigNumber.from(nft.metadata.id))}
                          
                          className='px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-600'
                        >
                          Stake
                        </Web3Button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>

            <ToastContainer />
          </>
        )
        }
        <div className="p-6" > </div>
      </div>
    </>
  );
};

export default Home;