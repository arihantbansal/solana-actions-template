import {
	PublicKey,
	VersionedTransaction,
	SystemProgram,
	TransactionInstruction,
	TransactionMessage,
	Connection,
} from '@solana/web3.js';

export async function prepareTransaction(
	connection: Connection,
	instructions: TransactionInstruction[],
	payer: PublicKey
): Promise<VersionedTransaction> {
	const blockhash = await connection
		.getLatestBlockhash({ commitment: 'max' })
		.then((res) => res.blockhash);
	const messageV0 = new TransactionMessage({
		payerKey: payer,
		recentBlockhash: blockhash,
		instructions,
	}).compileToV0Message();
	return new VersionedTransaction(messageV0);
}

export async function prepareDonateTransaction(
	connection: Connection,
	sender: PublicKey,
	recipient: PublicKey,
	lamports: number
): Promise<VersionedTransaction> {
	const payer = new PublicKey(sender);
	const instructions = [
		SystemProgram.transfer({
			fromPubkey: payer,
			toPubkey: new PublicKey(recipient),
			lamports: lamports,
		}),
	];
	return prepareTransaction(connection, instructions, payer);
}

export const uint8ArrayToBase64 = (uint8Array: Uint8Array): string => {
	return Buffer.from(uint8Array).toString('base64');
};

const PRIORITY_FEE_SUBSCRIPTION_ADDRESSES = [
	'', // Add addresses here
];

export const getHeliusPriorityFees = async (): Promise<number> => {
	const HELIUS_RPC = process.env.HELIUS_RPC_URL;

	if (!HELIUS_RPC || !HELIUS_RPC.includes('helius')) {
		return 0;
	}

	try {
		const response = await fetch(HELIUS_RPC, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: '1',
				method: 'getPriorityFeeEstimate',
				params: [
					{
						accountKeys: PRIORITY_FEE_SUBSCRIPTION_ADDRESSES,
						options: {
							includeAllPriorityFeeLevels: true,
						},
					},
				],
			}),
		});
		const data = await response.json();

		return data.result.priorityFeeLevels.high;
	} catch (err) {
		console.log(err);
		return 0;
	}
};

export const clamp = (value: number, min: number, max: number): number => {
	return Math.max(min, Math.min(max, value));
};
