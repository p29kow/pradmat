const { compare } = require('bcrypt');
const { NotFoundError } = require('../helpers/error-handling/errors');

module.exports = (fastify) => {
    const { findOne } = require('./users')(fastify);
    async function validate(email, password) {
        try {
            const user = await findOne(email);
            if (!user) throw new NotFoundError('User not found');
            const isPassword = await compare(password, user.password);
            if (user && isPassword) {
                const { password, ...otherFields } = user;
                return otherFields;
            }
            return null;
        } catch (err) {
            console.log(err)
        }
    }

    return {
        validate
    }
}