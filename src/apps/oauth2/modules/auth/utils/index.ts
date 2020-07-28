import { Request, Response } from 'express';

export function handleSuccessLogin(
  req: Request,
  res: Response,
  intended: string,
  shouldRemember: boolean
) {
  if (shouldRemember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
  } else {
    req.session.cookie.expires = false;
  }

  req.session.passport.info = {
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    createdAt: Date.now(),
  };

  if (req.accepts('html')) {
    return res.redirect(intended || '/');
  }
  return res.json({
    returnTo: intended || '/',
  });
}
