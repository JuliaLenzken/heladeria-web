import { loginUser, registerUser } from '../services/authService.mjs';

export async function loginController(req, res) {
  try {
    const payload = await loginUser(req.body);
    res.status(200).json({ success: true, user: payload });
  } catch (error) {
    res.status(401).json({ success: false, message: error.message });
  }
}

export async function registerController(req, res) {
  try {
    const payload = await registerUser(req.body);
    res.status(201).json({ success: true, user: payload });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
}
