import {
  attachAuthCookie,
  loginUser,
  logoutUser,
  requestPasswordReset,
  resetPasswordWithToken,
  changePassword,
} from '../services/authService.js';
import { permissionsForRole } from '@vignak/shared';

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
      data: {
        user: user.toSafeObject(),
        permissions: permissionsForRole(user.role),
      },
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
    data: {
      user: req.user.toSafeObject(),
      permissions: permissionsForRole(req.user.role),
    },
  });
}

export async function forgotPassword(req, res, next) {
  try {
    const result = await requestPasswordReset(req.body.email, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const result = await resetPasswordWithToken(
      { token: req.body.token, password: req.body.password },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}

export async function changePasswordHandler(req, res, next) {
  try {
    const result = await changePassword(
      req.user._id,
      {
        currentPassword: req.body.currentPassword,
        newPassword: req.body.newPassword,
      },
      { ip: req.ip, userAgent: req.get('user-agent') },
    );
    res.json({ success: true, message: result.message });
  } catch (err) {
    next(err);
  }
}
