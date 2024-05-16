const { UnauthorisedError, NotFoundError } = require("./errors");

module.exports = async (error, request, reply) => {
    switch (error) {
        case error instanceof UnauthorisedError:
            reply.unauthorized();
            break;
        case error instanceof NotFoundError:
            reply.notFound();
            break;
    }
}