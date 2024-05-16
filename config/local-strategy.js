const { Strategy } = require("passport-local");

module.exports = (fastify) => {
    const { validate } = require('../services/auth')(fastify);
    return {
        LocalStrategy: new Strategy({
            usernameField: 'email'
        }, async function (username, password, done) {
            try {
                const user = await validate(username, password);
                if(!user) done(fastify.httpErrors.unauthorized());
                return done(null, user);
            } catch (err) {
                throw done(err);
            }
        }),
    }
}

