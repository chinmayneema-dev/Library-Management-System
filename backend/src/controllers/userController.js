const bcrypt = require('bcrypt');
const { User } = require('../models');

const changeOwnPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await User.findByPk(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const ok = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!ok) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });
    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to change password', error: error.message });
  }
};

const adminResetPassword = async (req, res) => {
  const { userId } = req.params;
  const { newPassword } = req.body;
  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    await user.update({ passwordHash });
    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to reset password', error: error.message });
  }
};

module.exports = {
  changeOwnPassword,
  adminResetPassword,
};






