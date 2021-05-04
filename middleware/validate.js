module.exports = validator => {
  return (req, res, next) => {
    const {error} = validator(req.body);
    if (error) return res.status(400).send({property:error.details[0].path[0],msg:error.details[0].message});
    next();
  };
};
