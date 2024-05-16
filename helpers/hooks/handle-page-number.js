const getMainPath = require("../get-main-path")

module.exports = async (request, reply) => {
    const sessionUrl = request.session.get('url');
    const requestUrl = getMainPath(request.url);
    if(sessionUrl !== requestUrl) {
        request.session.set('page', 1);
        request.session.set('url', requestUrl);
    }
}