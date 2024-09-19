import PayOS from '@payos/node';
import { config } from '../config/envConfig';

export const payos = new PayOS(
  config.PAYOS_CLIENT_ID,
  config.PAYOS_API_KEY,
  config.PAYOS_CHECKSUM_KEY
);
