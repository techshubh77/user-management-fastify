import userService from "../services/userService.js";


export const index = (request, reply) => {
    try {

    } catch (error) {
        request.log.error(`index users error: ${error.message}`);
        throw error;
    }
}

export const create = (request, reply) => {
    try {

    } catch (error) {
        request.log.error(`create user error: ${error.message}`);
        throw error;
    }
}
