import { NFTCard } from "../components/nftCard"
import { useState } from 'react'

const App = () => {
 const [wallet, setWalletAddress] = useState("");
 const [collection, setCollectionAddress] = useState("");
 const [NFTs, setNFTs] = useState([]);
 const [fetchForCollection, setFetchForCollection]=useState(false);
 const [pageToken, setPageToken] = useState('');
 const api_key = process.env.NEXT_PUBLIC_KEY;

 const fetchNFTs = async() => {
  let nfts; 
  console.log("fetching nfts");
  const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;
  var requestOptions = {
      method: 'GET'
    };
   
  if (!collection.length) {
  
    const fetchURL = `${baseURL}?owner=${wallet}`;

    nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
  } else {
    console.log("fetching nfts for collection owned by address")
    const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
    nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
  }

  if (nfts) {
    console.log("nfts:", nfts);
    setNFTs(nfts.ownedNfts)
  }
}

const fetchNFTsForCollection = async ( pageToken = '') => {

  if (collection.length) {
    var requestOptions = {
      method: 'GET'
    };
    console.log(pageToken);
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}&startToken=${pageToken}`;
    const nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    if (nfts) {
      console.log("NFTs in collection:", nfts);
      if (nfts.nextToken) {
        setPageToken(nfts.nextToken);
      } else {
        setPageToken('');
      }
      setNFTs(nfts.nfts);
    }
  }
}

 return (
   <div className="flex flex-col items-center justify-center py-8 gap-y-3">
     <div className="flex flex-col w-full justify-center items-center gap-y-2">
       <input disabled={fetchForCollection} 
        onChange={(e)=>{setWalletAddress(e.target.value)}}
        type={"text"} placeholder="Add your wallet address"></input>
       <input onChange={(e)=>{setCollectionAddress(e.target.value)}}
        type={"text"} placeholder="Add the collection address"></input>
       <label className="text-gray-600 "><input onChange={(e)=>{setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2"></input>Fetch for collection</label>
       <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
          () => {
           if (fetchForCollection) {
              fetchNFTsForCollection('');
           }else fetchNFTs()
         }
       }>Let's go! </button>
     </div>
     <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
       {
         NFTs.length && NFTs.map((nft, i) => {
           return (
             <NFTCard nft={nft} key={i}></NFTCard>
           )
         })
       }
     </div>
      {
        pageToken && <div className='text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5'
          onClick={() => fetchNFTsForCollection(pageToken)}> 
          View Next 100 NFTS</div>
      }
   </div>
 )
}

export default App