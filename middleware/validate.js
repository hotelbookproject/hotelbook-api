module.exports = validator => {
  return async (req, res, next) => {
    const abc=await validator(req.body)
      // .then(() => next())
      // .catch(e => {
      //   error = {
      //     property: e.path,
      //     msg: e.message,
      //   };
      //   return res.status(400).send(error);
      // });
      console.log(abc,"mm")
  };
};
