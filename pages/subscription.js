import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'
import Loading from "../components/Loading";
import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'

//const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//const nft_address = '0x0A36498Fb8E7fdbb0BB04Eb0a659B032963529F8'//process.env.NFT_ADD
//const nft_market_address = '0xba371bAfafc35b6cCFc51B8F9A70d5Ff60E757f2'//process.env.NFT_ADD

const client = ipfsHttpClient(process.env.IPFS_URL)
const nft_address = process.env.NFT_ADDRESS
const nft_market_address = process.env.MARKET_ADDRESS



const Createnft = () => {
	const [fileUrl, setFileUrl] = useState(false)
	const [processing, setProcessing] = useState(false)
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })


	async function onChange(e) {
		setProcessing(true)
		const file = e.target.files[0]
		try {
			const added = await client.add(
				file,
				{
					progress: (prog) => console.log(`received: ${prog}`)
				}
			)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`
			setFileUrl(url)
			setProcessing(false)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}
	async function createMarket() {

		const { name, description, price } = formInput
		if (!name || !description || !price || !fileUrl) return
		/* first, upload to IPFS */
		const data = JSON.stringify({
			name, description, image: fileUrl
		})
		try {
			const added = await client.add(data)
			const url = `https://ipfs.infura.io/ipfs/${added.path}`
			console.log(url)
			/* after file is uploaded to IPFS, pass the URL to save it on Polygon */
			createSale(url)
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}

	async function testSell() {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()
		const price = ethers.utils.parseUnits('0.0025', 'ether')

		let contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()
		transaction = await contract.createMarketItem(nft_address, 3, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		console.log(myNFTs)
	}

	async function createSale(url) {
		setProcessing(true)

		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		/* next, create the item */
		let contract = new ethers.Contract(nft_address, NFT, signer)
		let transaction = await contract.createToken(url)
		let tx = await transaction.wait()
		let event = tx.events[0]
		let value = event.args[2]
		let tokenId = value.toNumber()


		const price = ethers.utils.parseUnits(formInput.price, 'ether')
		/* then list the item for sale on the marketplace */
		contract = new ethers.Contract(nft_market_address, NFT_MARKET, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()

		transaction = await contract.createMarketItem(nft_address, tokenId, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		console.log(myNFTs)
		setProcessing(false)

	}


	return (
		<>
			<div className="flex justify-center">
				<div className="w-1/2 flex flex-col pb-12">
					<input
						placeholder="Subscription Name"
						className="mt-8 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
					/>
					<textarea
						placeholder="Subscription Description"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
					/>
					<input
						placeholder="Subscription Price in Eth"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
					/>
					<input
						type="file"
						name="Asset"
						className="my-4"
						onChange={onChange}
					/>
					{processing && <Loading></Loading>}
					{
						fileUrl && (
							<img className="rounded mt-4" width="350" src={fileUrl} />
						)
					}
					{fileUrl && <button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
						Create Digital Asset
					</button>}
				</div>
			</div>
		</>
	)
}

Createnft.layout = 'LD'
export default Createnft