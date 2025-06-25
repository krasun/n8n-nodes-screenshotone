export async function screenshotOneRequest({
	endpoint,
	url,
	access_key,
	scenario,
	extra = {},
}: {
	endpoint: 'take' | 'animate';
	url: string;
	access_key: string;
	scenario?: string;
	extra?: Record<string, any>;
}): Promise<Record<string, any>> {
	let apiEndpoint = `https://api.screenshotone.com/${endpoint}`;
	const params: Record<string, string> = {
		url,
		access_key,
		...Object.fromEntries(Object.entries(extra).filter(([_, value]) => value !== undefined)),
	};

	if (endpoint === 'animate' && scenario) {
		params.scenario = scenario;
	}

	const query = new URLSearchParams(params).toString();
	const requestUrl = `${apiEndpoint}?${query}`;
	const response = await fetch(requestUrl);
	const contentType = response.headers.get('content-type') || '';

	let type: 'json' | 'text' | 'base64';
	let data: any;
	if (contentType.includes('application/json')) {
		data = await response.json();
		type = 'json';
	} else if (contentType.includes('text/')) {
		data = await response.text();
		type = 'text';
	} else {
		const buffer = await response.arrayBuffer();
		data = { base64: Buffer.from(buffer).toString('base64') };
		type = 'base64';
	}

	return { content_type: contentType, type, response: data };
}
