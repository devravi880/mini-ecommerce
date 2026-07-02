import { sendSuccess } from '../utils/apiResponse.js';
import { registerUser, loginUser, getUserById } from '../services/authService.js';

const register = async (req, res) => {
  const { user, token } = await registerUser(req.body);

  sendSuccess(res, {
    statusCode: 201,
    message: 'Registration successful',
    data: { user, token },
  });
};

const login = async (req, res) => {
  const { user, token } = await loginUser(req.body);

  sendSuccess(res, {
    message: 'Login successful',
    data: { user, token },
  });
};

const getMe = async (req, res) => {
  const user = await getUserById(req.user.id);

  sendSuccess(res, {
    message: 'Profile fetched successfully',
    data: { user },
  });
};

export { register, login, getMe };
