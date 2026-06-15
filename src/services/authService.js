const bcrypt = require('bcryptjs');
const { z } = require('zod');
const userRepository = require('../repositories/userRepository');
const { signToken } = require('../utils/jwt');

const signupSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30).regex(/^[a-zA-Z0-9_]+$/, 'Username only letters, numbers, underscore'),
  password: z.string()
    .min(8)
    .regex(/[A-Z]/, 'Password must contain uppercase letter')
    .regex(/[a-z]/, 'Password must contain lowercase letter')
    .regex(/[0-9]/, 'Password must contain number'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signup = async (payload) => {
  const data = signupSchema.parse(payload);

  const existingEmail = await userRepository.findByEmail(data.email);
  if (existingEmail) {
    const error = new Error('Email already registered');
    error.statusCode = 409;
    throw error;
  }

  const existingUsername = await userRepository.findByUsername(data.username);
  if (existingUsername) {
    const error = new Error('Username already registered');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);
  const user = await userRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  const token = signToken({ id: user.id, email: user.email, username: user.username });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      createdAt: user.createdAt,
    },
    token,
  };
};

const login = async (payload) => {
  const data = loginSchema.parse(payload);
  const user = await userRepository.findByEmail(data.email);

  if (!user) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const isValidPassword = await bcrypt.compare(data.password, user.password);
  if (!isValidPassword) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = signToken({ id: user.id, email: user.email, username: user.username });

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    token,
  };
};

module.exports = {
  signup,
  login,
};
