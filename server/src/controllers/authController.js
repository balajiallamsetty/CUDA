import {
  attachAuthCookie,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetPasswordWithToken,
  changePassword,
} from '../services/authService.js';
import { getProfile, updateProfile } from '../services/meService.js';
import { listMyLeads, getMyLead } from '../services/myLeadService.js';
import { permissionsForRole } from '@vignak/shared';

export async function register(req, res, next) {
  try {
    const { user, token } = await registerUser(req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    attachAuthCookie(res, token);
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        user: user.toSafeObject(),
        permissions: permissionsForRole(user.role),
      },
    });
  } catch (err) {
    next(err);
  }
}

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

export async function getMyProfile(req, res, next) {
  try {
    const user = await getProfile(req.user._id);
    res.json({ success: true, data: { user: user.toSafeObject() } });
  } catch (err) {
    next(err);
  }
}

export async function patchMyProfile(req, res, next) {
  try {
    const user = await updateProfile(req.user._id, req.body, {
      ip: req.ip,
      userAgent: req.get('user-agent'),
    });
    res.json({ success: true, message: 'Profile updated', data: { user: user.toSafeObject() } });
  } catch (err) {
    next(err);
  }
}

export async function getMyLeads(req, res, next) {
  try {
    const result = await listMyLeads(req.user._id, req.query);
    res.json({ success: true, data: result.items, meta: result.meta });
  } catch (err) {
    next(err);
  }
}

export async function getMyLeadById(req, res, next) {
  try {
    const lead = await getMyLead(req.user._id, req.params.id);
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
}
