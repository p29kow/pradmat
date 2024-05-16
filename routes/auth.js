module.exports = (fastifyPassport) => {
    return {
        authRoute: async (fastify) => {
            fastify.register(require('@fastify/rate-limit'), {
                max: 3
            });
            
            fastify.get('/login', async (request, reply) => {
                return reply.viewAsync('/pages/auth/login.ejs', {
                    title: 'Login',
                    user: request.user
                });
            });

            fastify.post('/login',
                { preValidation: fastifyPassport.authenticate('local') },
                async (request, reply) => {
                    return reply.redirect('/categories');
                });
        }
    }
}