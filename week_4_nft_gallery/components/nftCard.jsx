import { useState } from 'react'
import Icon from '../public/images/copy.png'
import copiedIcon from '../public/images/archives.png'

export const NFTCard = ({ nft }) => {

    const [copyIcon, setCopyIcon] = useState(Icon.src);
  
    const copyContract = (contractAddress) => {
  
      navigator.clipboard.writeText(contractAddress)
      .then(() => {
        setCopyIcon(copiedIcon.src);
        setTimeout(()=> setCopyIcon(Icon.src), 1000);
      });
    }

    return (
        <div className="w-1/4 flex flex-col ">
        <div className="rounded-md">
            <img className="object-cover h-128 w-full rounded-t-md" src={nft.media[0].gateway} ></img>
        </div>
        <div className="flex flex-col y-gap-2 px-2 py-3 bg-slate-100 rounded-b-md h-110 ">
            <div className="">
                <h2 className="text-xl text-gray-800">{nft.title}</h2>
                <p className="text-gray-600">Id: {parseInt(nft.id.tokenId, 16)}</p>
                {/* <p className="text-gray-600">Id: {nft.id.tokenId}</p> */}
                <div className='address-wrapper'>
                <p className="text-gray-600" >{nft.contract.address.substr(0,6)}....{nft.contract.address.substr(nft.contract.address.length-4)}</p>
                <img onClick={() => copyContract(nft.contract.address)} className="copyIcon" src={copyIcon} alt="copy address" ></img>
                </div>
            </div>

            {/* <div className="flex-grow mt-2">
                <p className="text-gray-600">{nft.description}</p>
            </div> */}
          <div>
            <a target='_blank' href={`https://etherscan.io/token/${nft.contract.address}`}>View on etherscan</a>
          </div>
        </div>

    </div>
    )
}