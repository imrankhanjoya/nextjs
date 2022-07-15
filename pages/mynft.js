import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Nft from "../components/Nft";

const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'



const Mynft = () => {
	const [nftItems, setNftItems] = useState([])
	const [connectedms, setConnectedms] = useState(false)
	const [address, setAddress] = useState(null)


	useEffect(() => {

		nftItemlist()

	}, [])


	async function nftItemlist() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const tokenContract = new ethers.Contract(nft_address, NFT.abi, provider)
		const signer = provider.getSigner()
		console.log(signer)
		/* then list the item for sale on the marketplace */
		const contract = new ethers.Contract(nft_market_address, NFT_MARKET.abi, signer)
		let nftAllItems = await contract.fetchMarketItems()
		const items = await Promise.all(nftAllItems.map(async i => {
			console.log(i)
			const tokenUri = await tokenContract.tokenURI(i.tokenId)
			// console.log(tokenUri)
			const meta = await axios.get(tokenUri)
			let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
			let item = {
				price,
				itemId: i.itemId.toNumber(),
				seller: i.seller,
				owner: i.owner,
				image: meta.data.image,
				name: meta.data.name,
				description: meta.data.description,
			}
			return item
		}))
		setNftItems(items)

	}


	return (
		<>
			<div className="container px-5 py-24 mx-auto">
				<span>{address}</span>
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

Mynft.layout = 'LD'
export default Mynft