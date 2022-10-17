import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Nft from "../components/Nft";

const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'



const Purchase = () => {
	const [nftItems, setNftItems] = useState([])
	const [address, setAddress] = useState('')



	useEffect(() => {

		nftItemlist()

	}, [])


	async function nftItemlist() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const tokenContract = new ethers.Contract(nft_address, NFT, provider)
		const signer = provider.getSigner()
		Promise.resolve(signer.getAddress()).then((values) => {
			setAddress(values);
		});
		/* then list the item for sale on the marketplace */
		const contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let nftAllItems = await contract.fetchMyNFTs()
		console.log(nftAllItems)
		const items = await Promise.all(nftAllItems.map(async i => {
			const tokenUri = await tokenContract.tokenURI(i.tokenId)
			console.log(tokenUri)
			let position = tokenUri.search("metadata.json");
			if(position != -1){
				
				let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
				let item = {
					price,
					itemId: i.itemId.toNumber(),
					seller: i.seller,
					tokenUri:tokenUri,
					owner: i.owner,
					image: 'https://api.time.com/wp-content/uploads/2021/03/nft-art-1.jpg?quality=85&w=300',
					name:"NFT name...",
					description: "NFT description...",
					tokenId: i.tokenId._hex,
					nftContract: i.nftContract,
				}
				return item
				
			}else{
				console.log(tokenUri)
				return false
			}
		}))
		setNftItems(items)

	}


	return (
		<>
			<div className="container px-5 py-5 mx-auto">
				<div className="w-full bg-yellow-400 p-5 mb-10 rounded text-center">
					<label className="text-[40px] text-white font-bold">NFT purchase @ {address}</label>
				</div>
				<div className="grid grid-cols-4">
					{nftItems.map((item, index) => {
						return (
							<div className="p-5" key={index}>
								<Nft item={item} ></Nft>
							</div>
						)
					})
					}


				</div>
			</div>
		</>
	)
}

Purchase.layout = 'LD'
export default Purchase