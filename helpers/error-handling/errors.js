class UnauthorisedError extends Error {
    super(msg) {
        this.name = 'UnauthorisedError';
        this.message = msg;
    }
}

class ForbiddenError extends Error {
    super(msg) {
        this.name = 'ForbiddenError';
        this.message = msg;
    }
}

class ConflictError extends Error {
    super(msg) {
        this.name = 'ConflictError';
        this.message = msg;
    }
}

class NotFoundError extends Error {
    super(msg) {
        this.name = 'NotFoundError';
        this.message = msg;
    }
}

class InternalServerError extends Error {
    super(msg) {
        this.name = 'InternalServerError';
        this.message = msg;
    }
}

module.exports = {
    UnauthorisedError,
    ForbiddenError,
    ConflictError,
    NotFoundError,
    InternalServerError
}