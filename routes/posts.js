const capitalise = require('../helpers/capitalise');
const isLoggedIn = require('../helpers/hooks/is-logged-in');
const { JSDOM } = require('jsdom');
const createDOMPurify = require('dompurify');
const { marked } = require('marked');

const postRoute = async (fastify) => {
    const { create, findAll, findOne, update, remove } = require('../services/posts')(fastify);
    const { findAll: findAllCategories } = require('../services/categories')(fastify);

    fastify.post('/',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await create({
                title: request.body.title,
                status: request.body.status,
                content: request.body.content,
                categoryId: request.body.categoryId
            });
            return reply.redirect('/categories');
        });

    fastify.get('/add',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            const categories = await findAllCategories();
            return reply.viewAsync('/pages/posts/add.ejs', {
                title: 'Add Post',
                categories,
                user: request.user
            });
        });

    fastify.get('/', async (request, reply) => {
        const posts = await findAll();
        return reply.viewAsync('/pages/posts/all.ejs', {
            title: 'Index',
            posts,
            user: request.user
        });
    });

    fastify.get('/update/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            const post = await findOne(request.params.slug);
            const categories = await findAllCategories();
            const currentCategory = categories.find((category) => category.id === post.category_id);
            return reply.viewAsync('/pages/posts/update.ejs', {
                title: 'Update - ' + capitalise(post.title),
                post,
                categories,
                currentCategory,
                user: request.user
            });
        });

    fastify.get('/:slug', async (request, reply) => {
        const post = await findOne(request.params.slug);
        const window = new JSDOM().window;
        const DOMPurify = createDOMPurify(window);
        const content = DOMPurify.sanitize(marked(post.content));
        return reply.viewAsync('/pages/posts/single.ejs', {
            title: capitalise(post.title),
            post,
            user: request.user,
            content
        });
    });

    fastify.patch('/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await update(request.params.slug, {
                title: request.body.title,
                content: request.body.content,
                status: request.body.status,
                categoryId: request.body.categoryId
            });
            return reply.redirect('/categories');
        });

    fastify.delete('/:slug',
        { preValidation: isLoggedIn },
        async (request, reply) => {
            await remove(request.params.slug);
            return reply.redirect('/categories');
        });
}

module.exports = postRoute;