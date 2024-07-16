import process from 'node:process';

export const CONSTANT = '';
export const ENDPOINT =
	process.env.ENDPOINT ?? 'https://api.mainnet-beta.solana.com';
export const PORT = process.env.PORT || 3000;
export const HOST =
	process.env.NODE_ENV === 'development'
		? `http://localhost:${PORT}`
		: process.env.URL;
export const DEFAULT_REDIRECT_URL =
	process.env.DEFAULT_REDIRECT_URL ?? 'https://solana.com/';
export const DEFAULT_DONATION_DESTINATION_WALLET =
	process.env.DEFAULT_DONATION_DESTINATION_WALLET ??
	'3DPPCjvhTVSh9Uph6fGTTWEkUDVLW7TxKrirrEd3b1WB';
