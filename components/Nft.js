import { ethers } from 'ethers'
import axios from 'axios'
import Web3Modal from 'web3modal'

const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'


const Nft = ({ item }) => {

	async function makepurchase(nftContract, itemId, price) {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const tokenContract = new ethers.Contract(nft_address, NFT, provider)
		const signer = provider.getSigner()


		/* then list the item for sale on the marketplace */
		const contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		console.log(contract)

		const price_buy = ethers.utils.parseUnits(price.toString(), 'ether')

		await contract.createMarketSale(nftContract, itemId, {
			value: price_buy,
			gasLimit: 100000,
			nonce: undefined,
		})
	}
	return (
		<>
			{console.log(item.tokenId._hex)}
			<div className="rounded-lg  overflow-hidden">
				<img alt="content" className="object-cover object-center h-full w-full" src={item.image} />
			</div>
			<div className="flex flex-row space-x-5 p-2">
				<div className="text-green-600">Price: {item.price} eth</div>
				<button onClick={() => makepurchase(item.nftContract, item.tokenId._hex, item.price)} className="inline-flex items-center bg-green-100 border-0 mt-4  px-3 focus:outline-none hover:bg-green-200 rounded text-sm font-bold md:mt-0">Buy</button>
			</div>
			<div className="flex flex-col">
				<div className="text-sm break-words">tokenid:{item.tokenId._hex}</div>
				<div className="text-sm break-words	">Seller:{item.seller}</div>
				<div className="text-sm break-words	">Owner: {item.owner}</div>
			</div>
			<h2 className="text-xl font-medium title-font text-gray-900 mt-5">{item.name}</h2>
			<p className="text-base leading-relaxed mt-2">{item.description}</p>
			<a className="text-indigo-500 inline-flex items-center mt-3" href={"https://ropsten.etherscan.io/address/" + item.seller}>Learn More
				<svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-2" viewBox="0 0 24 24">
					<path d="M5 12h14M12 5l7 7-7 7"></path>
				</svg>
			</a>
		</>
	)
}

export default Nft