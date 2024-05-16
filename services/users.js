module.exports = (fastify) => {
    async function findOne(email) {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT * FROM users WHERE email = $1',
                [email]
            );
            return rows[0];
        } catch (err) {
            throw err
        } finally {
            client.release();
        }
    }

    return { findOne }
}