import {
	ActionGetResponse,
	ActionPostRequest,
	ActionPostResponse,
} from '@solana/actions';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import {
	prepareDonateTransaction,
	uint8ArrayToBase64,
} from '../utils/index.js';
import { Hono } from 'hono';
import {
	ENDPOINT,
	DEFAULT_REDIRECT_URL,
	HOST,
	DEFAULT_DONATION_DESTINATION_WALLET,
} from '../constants/index.js';

const connection = new Connection(ENDPOINT, 'confirmed');

const app = new Hono();

app.get('/', (c) => {
	return c.redirect(DEFAULT_REDIRECT_URL);
});

app.get('/blinks/donate', async (c) => {
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

	return c.json(response);
});

app.post('/transactions/donate', async (c) => {
	const req = await c.req.json<ActionPostRequest>();

	const returnErrorResponse = (message: string) => {
		return c.json({ message }, 400);
	};

	let sender: PublicKey | undefined;

	try {
		sender = new PublicKey(req.account);
	} catch (err) {
		// do nothing
	}

	if (!sender) {
		return returnErrorResponse('Invalid account');
	}

	const recipient = new PublicKey(
		c.req.query('dest') ?? DEFAULT_DONATION_DESTINATION_WALLET
	);

	const amount = c.req.query('amount').toString() ?? '0.1';
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

	return c.json(actionResponse);
});

export default app;
