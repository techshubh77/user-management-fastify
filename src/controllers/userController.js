import userService from '../services/userService.js';
import { successResponse } from '../utils/response.js';
import STATUS_CODES from '../config/constants.js';

export const index = async (request, reply) => {
  try {
    const users = await userService.index();
    return successResponse({
      reply,
      statusCode: STATUS_CODES.OK,
      data: users,
      message: 'Users data fetched successfully',
    });
  } catch (error) {
    request.log.error(`index users error: ${error.message}`);
    throw error;
  }
};

export const create = async (request, reply) => {
  try {
    const user = await userService.create(request.body);
    return successResponse({
      reply,
      statusCode: STATUS_CODES.CREATED,
      data: user,
      message: 'User created successfully',
    });
  } catch (error) {
    request.log.error(`create user error: ${error.message}`);
    throw error;
  }
};

export const update = async (request, reply) => {
  
}