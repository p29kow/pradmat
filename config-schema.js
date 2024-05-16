const configSchema = {
    type: 'object',
    required: ['COOKIE_KEY', 'DB', 'DB_HOST', 'DB_NAME', 'DB_PORT', 'DB_USERNAME', 'DB_PASSWORD'],
    properties: {
        SECRET: { type: 'string' },
        DB: { type: 'string' },
        DB_HOST: { type: 'string' },
        DB_PORT: { type: 'string' },
        DB_NAME: { type: 'string' },
        DB_USERNAME: { type: 'string' },
        DB_PASSWORD: { type: 'string' },
    }
}

module.exports = configSchema;