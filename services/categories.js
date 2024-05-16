const { randomUUID } = require('crypto');

module.exports = (fastify) => {
    async function create(body) {
        const client = await fastify.pg.connect();
        const id = randomUUID();
        const slug = body.name.split(' ').join('-').toLowerCase();
        try {
            await client.query(
                'INSERT INTO categories ' +
                '(id, name, slug) ' +
                'VALUES ($1, $2, $3)',
                [id, body.name, slug]
            );
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async function findAll(page) {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT * FROM categories ' +
                'ORDER BY name ASC'
            );
            return rows;
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async function findOne(slug) {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT * FROM categories WHERE slug = $1',
                [slug]
            );
            return rows[0];
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async function update(slug, body) {
        const client = await fastify.pg.connect();
        const newSlug = body.name.split(' ').join('-').toLowerCase();
        try {
            await client.query(
                'UPDATE categories ' +
                'SET name = $2, slug = $3 ' +
                'WHERE slug = $1',
                [slug, body.name, newSlug]
            );
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async function remove(slug) {
        const client = await fastify.pg.connect();
        try {
            await client.query(
                'DELETE FROM categories WHERE slug = $1',
                [slug]
            );
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    return {
        create, findAll, findOne, update, remove
    }
}