import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'
import Connectmessage from '../components/Connectmessage'
import Nft from "../components/Nft";

const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'



const Listnft = () => {
	const [nftItems, setNftItems] = useState([])
	const [connectedms, setConnectedms] = useState(false)

	const [address, setAddress] = useState('')
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })


	useEffect(() => {
		window.ethereum ?
			ethereum.request({ method: "eth_requestAccounts" }).then((accounts) => {
				console.log(accounts[0])
				setConnectedms(true)

			}).catch((err) => console.log(err))
			: setConnectedms(false)
		nftItemlist()

	}, [])


	async function nftItemlist() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const tokenContract = new ethers.Contract(nft_address, NFT, provider)
		const signer = provider.getSigner()
		console.log(signer)
		/* then list the item for sale on the marketplace */
		const contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let nftAllItems = await contract.fetchMarketItems()
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
		console.log("List of items ",items)
		setNftItems(items)

	}


	return (
		<>
			<div className="container px-5 py-5 mx-auto">
				<div className="w-full bg-yellow-400 p-5 mb-10 rounded text-center">
					<label className="text-[40px] text-white font-bold">Market @ 0x8DC2D4eC286f22fE15EfA0F2a012922BB86DAe29</label>
				</div>
				<div className="grid grid-cols-4">
					{
						nftItems.map((item, index) => {
							if(item){
								return (
									<div className="p-5" key={index} >
										<Nft item={item} ></Nft>
									</div>
								)
							}
						})
					}

				</div>
			</div>
		</>
	)
}

Listnft.layout = 'LD'
export default Listnft