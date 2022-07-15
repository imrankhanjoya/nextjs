import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { useRouter } from 'next/router'
import Web3Modal from 'web3modal'

const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
//const nft_address = '0x2dB2c9D4962A20B0fdDF2A7b407cE01203163e0D'//process.env.NFT_ADD
const nft_address = '0x0A36498Fb8E7fdbb0BB04Eb0a659B032963529F8'//process.env.NFT_ADD
const nft_market_address = '0xba371bAfafc35b6cCFc51B8F9A70d5Ff60E757f2'//process.env.NFT_ADD

import NFT from '../nft.json'
import NFT_MARKET from '../nft_market.json'

const Createnft = () => {
	const [fileUrl, setFileUrl] = useState(null)
	const [formInput, updateFormInput] = useState({ price: '', name: '', description: '' })


	async function onChange(e) {
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
		} catch (error) {
			console.log('Error uploading file: ', error)
		}
	}
	async function createMarket() {
		//createSale('https://bafybeigae7p7b6pf5d25d6onp2n7xd4pn3aud3csxufzjjn3d4lbunbwam.ipfs.infura-ipfs.io/')
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

		let contract = new ethers.Contract(nft_market_address, NFT_MARKET.abi, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()
		transaction = await contract.createMarketItem(nft_address, 3, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		console.log(myNFTs)
	}

	async function createSale(url) {
		const web3Modal = new Web3Modal()
		const connection = await web3Modal.connect()
		const provider = new ethers.providers.Web3Provider(connection)
		const signer = provider.getSigner()

		console.log("signer" + signer)
		/* next, create the item */
		let contract = new ethers.Contract(nft_address, NFT.abi, signer)
		let transaction = await contract.createToken(url)
		let tx = await transaction.wait()
		let event = tx.events[0]
		let value = event.args[2]
		let tokenId = value.toNumber()
		console.log("TokenId is " + tokenId)


		const price = ethers.utils.parseUnits(formInput.price, 'ether')
		console.log(price)
		/* then list the item for sale on the marketplace */
		contract = new ethers.Contract(nft_market_address, NFT_MARKET.abi, signer)
		let listingPrice = await contract.getListingPrice()
		listingPrice = listingPrice.toString()

		transaction = await contract.createMarketItem(nft_address, tokenId, price, { value: listingPrice })
		await transaction.wait()
		const myNFTs = await contract.fetchItemsCreated()
		console.log(myNFTs)
	}


	return (
		<>
			<div className="flex justify-center">
				<div className="w-1/2 flex flex-col pb-12">
					<input
						placeholder="Asset Name"
						className="mt-8 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, name: e.target.value })}
					/>
					<textarea
						placeholder="Asset Description"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, description: e.target.value })}
					/>
					<input
						placeholder="Asset Price in Eth"
						className="mt-2 border rounded p-4"
						onChange={e => updateFormInput({ ...formInput, price: e.target.value })}
					/>
					<input
						type="file"
						name="Asset"
						className="my-4"
						onChange={onChange}
					/>
					{
						fileUrl && (
							<img className="rounded mt-4" width="350" src={fileUrl} />
						)
					}
					<button onClick={createMarket} className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg">
						Create Digital Asset
					</button>
				</div>
			</div>
		</>
	)
}

Createnft.layout = 'LD'
export default Createnft