const { randomUUID } = require('crypto');

module.exports = (fastify) => {
    async function create(body) {
        const client = await fastify.pg.connect();
        const createdOn = new Date().toISOString();
        const id = randomUUID();
        const slug = body.title.split(' ').join('-').toLowerCase();
        try {
            await client.query(
                'INSERT INTO posts ' +
                '(id, title, content, status, slug, created_on, category_id) ' +
                'VALUES ($1, $2, $3, $4, $5, $6, $7)',
                [id, body.title, body.content, body.status, slug, createdOn, body.categoryId]
            );
        } catch (err) {
            throw err;
        } finally {
            client.release();
        }
    }

    async function getIndexPosts() {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT * FROM posts ' +
                'ORDER BY created_on DESC ' +
                'OFFSET 0 LIMIT 8'
            );
            return rows;
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            client.release();
        }
    }

    async function findAll(categoryId, page) {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT * FROM posts ' +
                'WHERE category_id = $1 ' +
                'ORDER BY created_on DESC ' +
                'OFFSET $2 LIMIT 8',
                [categoryId, (page - 1) * 8]
            );
            return rows;
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            client.release();
        }
    }

    async function getCount(categoryId) {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query(
                'SELECT COUNT(*) FROM posts ' +
                'WHERE category_id = $1',
                [categoryId]
            );
            return rows[0].count;
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
                'SELECT * FROM posts WHERE slug = $1',
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
        const updatedOn = new Date().toISOString();
        const newSlug = body.title.split(' ').join('-').toLowerCase();
        try {
            await client.query(
                'UPDATE posts ' +
                'SET title = $2, content = $3, status = $4, slug = $5, updated_on = $6, category_id = $7 ' +
                'WHERE slug = $1',
                [slug, body.title, body.content, body.status, newSlug, updatedOn, body.categoryId]
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
                'DELETE FROM posts WHERE slug = $1',
                [slug]
            );
        } catch (err) {
            console.log(err)
            throw err;
        } finally {
            client.release();
        }
    }
    return {
        create, findAll, getIndexPosts, findOne, update, remove, getCount
    }
}
