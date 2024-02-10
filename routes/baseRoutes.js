const express = require('express');

const router = express.Router();

const baseRoutes = {
  advertisementTypes: require('../controllers/advertisementType.controller'),
  advertisements: require('../controllers/advertisement.controller'),
  callendars: require('../controllers/calendar.controller'),
  classes: require('../controllers/classroom.controller'),
  followers: require('../controllers/follow.controller'),
  userRatings: require('../controllers/userRating.controller'),
  userTypes: require('../controllers/userType.controller'),
  users: require('../controllers/users.controller'),
  korepetytors: require('../controllers/korepetytors.controller'),
};

for (const [routeName, routeController] of Object.entries(baseRoutes)) {
  if (routeController.getAll) {
    router.get(`/${routeName}`, routeController.getAll);
  }

  if (routeController.getById) {
    router.get(`/${routeName}/:id`, routeController.getById);
  }
}

module.exports = router;
