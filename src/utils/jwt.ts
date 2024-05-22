import jwt, { VerifyOptions, SignOptions } from "jsonwebtoken";
// import Roles from "../constant/roles";

import { config } from "../config/envConfig";
const { secretKey } = config;
const ACCESS_TOKEN_EXP = "15m";
export const REFRESH_TOKEN_EXP = "30d";

// export type RefreshToken = {
//   sessionId: SessionDocument["_id"];
// };

export type AccessToken = {
  userId: string;
  //   sessionId: SessionDocument["_id"];
};

export const signToken = (
  payload: any,
  options?: SignOptions & {
    secret?: string;
  }
) => {
  const { secret = secretKey, ...opts } = options || {};
  return jwt.sign(payload, secret, {
    audience: "minh",
    expiresIn: ACCESS_TOKEN_EXP,
    ...opts,
  });
};

export const verifyToken = <T extends object = AccessToken>(
  token: string,
  options?: VerifyOptions & {
    secret?: string;
  }
) => {
  const { secret = secretKey, ...opts } = options || {};
  try {
    const payload = jwt.verify(token, secret, {
      //   audience: ,
      ...opts,
    }) as T;
    return {
      payload,
    };
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
};
