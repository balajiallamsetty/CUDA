import {
  attachAuthCookie,
  loginUser,
  logoutUser,
} from '../services/authService.js';

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(
      { email, password },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );
    attachAuthCookie(res, token);
    res.json({
      success: true,
      message: 'Logged in successfully',
      data: { user: user.toSafeObject() },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(req, res, next) {
  try {
    await logoutUser(req, res);
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  res.json({
    success: true,
    data: { user: req.user.toSafeObject() },
  });
}
