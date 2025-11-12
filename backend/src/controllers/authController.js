const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, Member } = require('../models');

const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({
      where: { username },
      include: [
        {
          model: Member,
          as: 'memberProfile',
        },
      ],
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const tokenPayload = {
      userId: user.userId,
      username: user.username,
      role: user.role,
      memberId: user.memberId,
    };

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    });

    return res.status(200).json({
      token,
      user: tokenPayload,
    });
  } catch (error) {
    return res.status(500).json({ message: 'Unable to login', error: error.message });
  }
};

module.exports = {
  login,
};







