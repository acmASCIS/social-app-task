import { HmacSHA512 } from 'crypto-js';
import Base64 from 'crypto-js/enc-base64';

const hashSHA512 = (str: string): string => {
  const hash = Base64.stringify(HmacSHA512(str, process.env.KEY));

  return hash;
};


export { hashSHA512 };
