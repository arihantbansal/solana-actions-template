import express, { Request, Response } from 'express';
import {
	ActionGetResponse,
	ActionPostResponse,
} from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
	prepareDonateTransaction,
	uint8ArrayToBase64,
} from '../utils/index.js';

const ENDPOINT = process.env.ENDPOINT ?? 'https://api.mainnet-beta.solana.com';
const PORT = process.env.PORT || 3000;
const HOST =
	process.env.NODE_ENV === 'development'
		? `http://localhost:${PORT}`
		: process.env.URL;
const DEFAULT_REDIRECT_URL = process.env.DEFAULT_REDIRECT_URL ?? 'https://solana.com/';
const DEFAULT_DONATION_DESTINATION_WALLET =
	process.env.DEFAULT_DONATION_DESTINATION_WALLET ??
	'3DPPCjvhTVSh9Uph6fGTTWEkUDVLW7TxKrirrEd3b1WB';
const connection = new Connection(ENDPOINT, 'confirmed');

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
	res.redirect(DEFAULT_REDIRECT_URL);
});

router.get('/blinks/donate', async (req: Request, res: Response) => {
	const icon =
		'https://img.fotofolio.xyz/?url=https%3A%2F%2Fraw.githubusercontent.com%2Fsolana-labs%2Ftoken-list%2Fmain%2Fassets%2Fmainnet%2FSo11111111111111111111111111111111111111112%2Flogo.png';

	const label = 'Tip SOL';
	const title = `Tip a friend!`;
	const description = 'Sample action to tip a friend with SOL';
	const disabled = false;
	const amountQuery = 'depositAmount';

	const links: ActionGetResponse['links'] = {
		actions: [
			{
				href: `${HOST}/transactions/donate?amount={${amountQuery}}`,
				label: 'Tip a friend',
				parameters: [
					{
						name: amountQuery,
						label: `SOL amount to tip`,
					},
				],
			},
		],
	};

	const response: ActionGetResponse = {
		icon,
		label,
		title,
		description,
		disabled,
		links,
	};

	return res.json(response);
});

router.post('/transactions/donate', async (req: Request, res: Response) => {
	const returnErrorResponse = (message: string) => {
		return res.status(400).json({ message });
	};

	let sender: PublicKey | undefined;

	try {
		sender = new PublicKey(req.body.account);
	} catch (err) {
		// do nothing
	}

	if (!sender) {
		return returnErrorResponse('Invalid account');
	}

	const recipient = new PublicKey(
		req.query.dest ?? DEFAULT_DONATION_DESTINATION_WALLET
	);

	const restOfQueryParams = { ...req.query };
	delete restOfQueryParams.utm_source;
	delete restOfQueryParams.utm_medium;
	delete restOfQueryParams.utm_campaign;
	delete restOfQueryParams.utm_term;
	delete restOfQueryParams.utm_content;

	const amount = req.query.amount.toString() ?? '0.1';
	const parsedAmount = parseFloat(amount);

	const txn = await prepareDonateTransaction(
		connection,
		new PublicKey(sender),
		new PublicKey(recipient),
		parsedAmount * LAMPORTS_PER_SOL
	);

	const actionResponse: ActionPostResponse = {
		transaction: uint8ArrayToBase64(txn.serialize()),
		message: 'Successfully tipped SOL.',
	};

	return res.json(actionResponse);
});

export default router;
