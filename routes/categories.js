const categoryRoute = async (fastify) => {
    const { create, findAll, findOne, update, remove } = require('../services/categories')(fastify);
    const { findAll: findPosts, getCount } = require('../services/posts')(fastify);
    const isLoggedIn = require('../helpers/hooks/is-logged-in');

    fastify.post('/',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await create(request.body);
            return reply.redirect('/categories');
        });

    fastify.get('/add',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            return reply.viewAsync('/pages/categories/add.ejs', {
                title: 'Add Category',
                user: request.user
            });
        });

    fastify.get('/', async (request, reply) => {
        const categories = await findAll();
        return reply.viewAsync('/pages/categories/all.ejs', {
            title: 'Categories',
            categories,
            user: request.user
        });
    });

    fastify.get('/update/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            const category = await findOne(request.params.slug);
            return reply.viewAsync('/pages/categories/update.ejs', {
                title: 'Edit - ' + category.name,
                category,
                user: request.user
            });
        });

    fastify.get('/:slug',
        async (request, reply) => {
            let page = request.query.page ?? 1;
            if(page <= 0) page = 1;
            const category = await findOne(request.params.slug);
            const posts = await findPosts(category.id, +page);
            const postCount = await getCount(category.id);
            const pageCount = Math.ceil(postCount / 8);
            return reply.viewAsync('/pages/categories/single.ejs', {
                title: category.name,
                posts,
                category,
                user: request.user,
                pageCount,
            });
        });

    fastify.patch('/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await update(request.params.slug, request.body);
            return reply.redirect('/categories');
        });

    fastify.delete('/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await remove(request.params.slug);
            return reply.redirect('/categories');
        });
}

module.exports = categoryRoute;
