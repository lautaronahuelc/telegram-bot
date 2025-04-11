function validateEnvVariables(config) {
  for (const [key, value] of Object.entries(config)) {
    if (!value) {
      console.warn(`⚠️ Missing environment variable: ${key}`);
    }
  }
}

function getEnvConfig() {
  const baseConfig = {
    AUTHORIZED_USERS: process.env.AUTHORIZED_USERS,
    NODE_ENV: process.env.NODE_ENV,
  };
  const config =
    process.env.NODE_ENV === 'production'
      ? {
          ...baseConfig,
          BOT_TOKEN: process.env.BOT_TOKEN,
          BOT_USERNAME: process.env.BOT_USERNAME,
          MONGO_URI: process.env.MONGO_URI,
        }
      : {
          ...baseConfig,
          BOT_TOKEN: process.env.BOT_TOKEN_TEST,
          BOT_USERNAME: process.env.BOT_USERNAME_TEST,
          MONGO_URI: process.env.MONGO_URI_TEST,
        };
  validateEnvVariables(config);
  return config;
}

export const envConfig = getEnvConfig();