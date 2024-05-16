module.exports = async (error, request, reply) => {
    switch (error.message) {
        case 'Unauthorized':
            reply.redirect('/');
            break;
        case 'NotFound':
            reply.redirect('/');
            break;
    }
}