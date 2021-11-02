const PROD_API = 'https://api.cloud.getoctane.io';

export const API_BASE = process.env.OCT_API_BASE_OVERRIDE ?? PROD_API;
