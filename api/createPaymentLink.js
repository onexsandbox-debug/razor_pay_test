module.exports = (req, res) => {
  res.status(200).json({
    message: "API WORKING",
    method: req.method
  });
};
