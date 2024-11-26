import axios from 'axios';
import { config } from '$lib/server/config/environment.js';
import https from 'https';
import type { QuerySearchInterface } from '$lib/models/establishment/establishment_query_search.js';

const agent = new https.Agent({
	rejectUnauthorized: false // ONLY FOR DEVELOPMENT
});

interface EstablishmentQueryParams {
	longitude?: number;
	latitude?: number;
	establishment_id?: number;
	establishment_name?: string;
	vehicle_type_id?: number;
	is_24_hours?: boolean;
}

export async function search({
	longitude,
	latitude,
	establishment_id,
	establishment_name,
	vehicle_type_id,
	is_24_hours
}: EstablishmentQueryParams): Promise<QuerySearchInterface> {
	const queryUrl = `${config.api.baseUrl}:${config.api.port}/${config.api.version}${config.api.endpoints.establishment.root}${config.api.endpoints.establishment.endpoints.query}`;

	const response = axios.get(queryUrl, {
		params: {
			longitude,
			latitude,
			establishment_id,
			establishment_name,
			vehicle_type_id,
			is_24_hours
		},
		withCredentials: true,
		httpsAgent: agent
	});
	return (
		(await response).data
	);
}
