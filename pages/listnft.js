import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Connectmessage from '../components/Connectmessage'

const client = ipfsHttpClient(process.env.IPFS_INFURA)
//const nft_address = '0x2dB2c9D4962A20B0fdDF2A7b407cE01203163e0D'//process.env.NFT_ADD
const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'
let rpcEndpoint = null

if (process.env.NEXT_PUBLIC_WORKSPACE_URL) {
	rpcEndpoint = process.env.NEXT_PUBLIC_WORKSPACE_URL
}


const Listnft = () => {
	const [nftItems, setNftItems] = useState([])
	const [connectedms, setConnectedms] = useState(false)

	const [address, setAddress] = useState('')
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })


	useEffect(() => {
		window.ethereum ?
			ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
				setAddress(accounts[0])
				let w3 = new Web3(ethereum)
				setWeb3(w3)
				setConnectedms(true)

			}).catch((err) => console.log(err))
			: setConnectedms(false)
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
				{!connectedms &&
					<Connectmessage></Connectmessage>
				}
				<div className="flex flex-wrap sm:-m-4 -mx-4 -mb-10 -mt-4">
					{
						nftItems.map((item, index) => {
							return (

								<div key={index} className="p-4 md:w-1/3 sm:mb-0 mb-6">
									<div className="rounded-lg h-64 overflow-hidden">
										<img alt="content" className="object-cover object-center h-full w-full" src={item.image} />
									</div>
									<h2 className="text-xl font-medium title-font text-gray-900 mt-5">{item.name}</h2>
									<p className="text-base leading-relaxed mt-2">{item.description}</p>
									<a className="text-indigo-500 inline-flex items-center mt-3">Learn More
										<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
											<path d="M5 12h14M12 5l7 7-7 7"></path>
										</svg>
									</a>
								</div>
							)
						})
					}

				</div>
			</div>
		</>
	)
}

Listnft.layout = 'LD'
export default Listnft