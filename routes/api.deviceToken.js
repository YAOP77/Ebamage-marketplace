// POST /api/device-token
router.post('/device-token', async (req, res) => {
  const { userId, deviceToken } = req.body;
  await User.findByIdAndUpdate(userId, { deviceToken });
  res.status(200).json({ success: true });
});