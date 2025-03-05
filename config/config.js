require('dotenv').config();

const config = {
    NODE_ENV: process.env.NODE_ENV || "development",
    PORT: process.env.PORT || 4000,
    SECRET_KEY: process.env.SECRET_KEY || "umasenhaqualquer"
};

module.exports = config;