/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
	/* config options here */
	env: {
		NFT_ADDRESS: "0x33267e3fCA7A343e84AECd794465be5Ad6d9E5dB",
		MARKET_ADDRESS: "0x8DC2D4eC286f22fE15EfA0F2a012922BB86DAe29",
		IPFS_URL: "https://ipfs.infura.io:5001/api/v0"
	}
}

module.exports = nextConfig