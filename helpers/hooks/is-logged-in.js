module.exports = async (request, reply) => {
    if (!request.user) return reply.unauthorized();
}
