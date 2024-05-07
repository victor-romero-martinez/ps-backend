import 'dotenv/config';

export const CONSTANTS = {
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  bcrypt: {
    rounds: 10,
  },
  db: {
    host: process.env.HOST,
    port: +process.env.PORT_DB,
    user: process.env.USER_NAME,
    password: process.env.USER_PASSWORD,
    database: process.env.DATABASE,
    sync: !!process.env.SYNCHRONIZE,
  },
};
