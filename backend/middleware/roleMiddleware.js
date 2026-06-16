const authorize =
(...roles) => {

  return (req, res, next) => {

    if (
      !roles.includes(
        req.user.roleName
      )
    ) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    next();
  };
};

module.exports = authorize;


// {
//   userId: user._id,
//   roleName: user.roleId.name
// }

// router.get(
//   "/recruiter-dashboard",
//   auth,
//   authorize("Recruiter"),
//   recruiterController.dashboard
// );