import bcrypt from 'bcrypt';

const saltRounds = 10;
export const hashPassword = async (req, _res, next) => {
  try {
    const body = req.validated?.body || req.body;

    if (body?.password) {
      body.password = await bcrypt.hash(body.password, saltRounds);
    }
    next();
  } catch (error) {
    next(error);
  }
};
