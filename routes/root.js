const rootRoute = async (fastify) => {
    const { getIndexPosts } = require('../services/posts')(fastify);
    fastify.get('/', async (request, reply) => {

        const unauthorisedMsg = reply.flash('unauthorised');
        const posts = await getIndexPosts();
        return reply.viewAsync('/pages/root/index.ejs', {
            title: 'Home - Pradmat',
            posts,
            user: request.user,
            unauthorisedMsg
        });
    });

    fastify.get('/about', async (request, reply) => {
        return reply.viewAsync('/pages/root/about.ejs', {
            title: 'About - Pradmat',
            user: request.user
        });
    });
}

module.exports = rootRoute;