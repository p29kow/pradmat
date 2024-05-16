require('dotenv').config();
const Fastify = require('fastify');
const fastify = Fastify({ logger: false });
const fastifyView = require('@fastify/view');
const fastifySession = require('@fastify/secure-session');
const { Authenticator } = require('@fastify/passport');
const { LocalStrategy } = require('./config/local-strategy')(fastify);
const { join } = require('path');
const errorHandler = require('./helpers/error-handling/error-handler');
const exceptionFilter = require('./helpers/error-handling/exception-filter');
const configSchema = require('./config-schema');

fastify.register(require('@fastify/helmet'), {
    contentSecurityPolicy: {
        directives: {
            "script-src": ["'self'", "https://udbaa.com/bnr.php?section=General&pub=375138&format=300x250&ga=g"]
        }
    }
});
fastify.register(require('@fastify/csrf-protection'));

fastify.register(require('@fastify/env'), {
    schema: configSchema,
    dotenv: { path: '.env' }
});

fastify.register(require('@fastify/postgres'), {
    connectionString:
        process.env.DB + '://' +
        process.env.DB_USERNAME + ':' +
        process.env.DB_PASSWORD + '@' +
        process.env.DB_HOST + ':' +
        process.env.DB_PORT + '/' +
        process.env.DB_NAME,
});

fastify.register(fastifySession, {
    sessionName: 'session',
    cookieName: 'sessionCookie',
    key: Buffer.from(process.env.COOKIE_KEY, 'hex'),
    expiry: 60 * 60,
    cookie: {
        path: '/',
        httpOnly: true
    }
});

const fastifyPassport = new Authenticator();
fastify.register(fastifyPassport.initialize());
fastify.register(fastifyPassport.secureSession());
fastifyPassport.use(LocalStrategy);

fastifyPassport.registerUserSerializer(async (user, request) => user);
fastifyPassport.registerUserDeserializer(async (user, request) => {
    return { 
        id: user.id,
        email: user.email
     }
}
);

fastify.register(require('fastify-method-override'));

fastify.register(fastifyView, {
    root: join(__dirname, 'views'),
    engine: { ejs: require('ejs') }
});

fastify.register(require('@fastify/static'), {
    root: join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.register(require('@fastify/static'), {
    root: join(__dirname, 'uploads', 'posts'),
    prefix: '/uploads/',
    decorateReply: false
});

fastify.register(require('@fastify/sensible'));
fastify.register(require('@fastify/formbody'));

fastify.register(require('./routes/root'));
fastify.register(require('./routes/auth')(fastifyPassport).authRoute, { prefix: '/auth' });
fastify.register(require('./routes/categories'), { prefix: '/categories' });
fastify.register(require('./routes/posts'), { prefix: '/posts' });

fastify.setErrorHandler(errorHandler);
fastify.setErrorHandler(exceptionFilter);

const startApp = async () => {
    try {
        await fastify.listen({
            host: ("RENDER" in process.env) ? `0.0.0.0` : `localhost`,
            port: process.env.PORT || 3000
        });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
}

startApp();
