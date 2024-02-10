const express = require('express');
const rankingRoutes = require('./rankingRoutes');
const calendarRoutes = require('./calendarRoutes');
const authRoutes = require('./authRoutes');
const baseRoutes = require('./baseRoutes');
const classRoutes = require('./classroomRoutes');
const adRoutes = require('./adRoutes');
const profileRoutes = require('./profileRoutes');
const undefinedRoutesHandler = require('./undefinedRoutes');
const swaggerRouter = require('../config/swagger');
const fileRoutes = require('./fileRoutes');
const commentsRoutes = require('./commentsRoutes');
const followRoutes = require('./followRoutes');

const router = express.Router();

router.use('/api-docs', swaggerRouter);

router.use('/api/v1', baseRoutes);

router.use('/api/v1', authRoutes);

router.use('/api/v1', adRoutes);

router.use('/api/v1', profileRoutes);

router.use('/api/v1', classRoutes);

router.use('/api/v1', rankingRoutes);

router.use('/api/v1', calendarRoutes);

router.use('/api/v1', fileRoutes);

router.use('/api/v1', commentsRoutes);

router.use('/api/v1', followRoutes);

router.use('*', undefinedRoutesHandler);

module.exports = router;
