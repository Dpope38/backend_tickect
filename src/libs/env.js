import dotenv from "dotenv";

dotenv.config();

export const envConfig= {
PORT : process.env.PORT || 3003, 
NODE_ENV : process.env.NODE_ENV || 'development',
JWT_SECRET : process.env.JWT_SECRET,
DATABASE_URL : process.env.DATABASE_URL,
JWT_EXPIRATION : process.env.JWT_EXPIRATION
}

