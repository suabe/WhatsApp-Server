'use strict'
const cache = require('./../lib/cache'),
  express = require('express'),
  router = express.Router(),
  controllers = require('../controllers'),
  { initialize } = require('../whatsapp'),
  { sendBlastMessage } = require('../controllers/blast'),
  {
    checkDestination,
    checkConnectionBeforeBlast,
  } = require('../lib/middleware')
router.get('/', (_0x24c6ab, _0xc1da0) => {
  const _0x32c109 = require('path')
  _0xc1da0.sendFile(_0x32c109.join(__dirname, '../../public/index.html'))
})
router.post('/backend-logout', controllers.deleteCredentials)
router.post('/backend-generate-qr', controllers.createInstance)
router.post('/backend-initialize', initialize)
router.post('/backend-send-list', checkDestination, controllers.sendListMessage)
router.post(
  '/backend-send-template',
  checkDestination,
  controllers.sendTemplateMessage
)
router.post(
  '/backend-send-button',
  checkDestination,
  controllers.sendButtonMessage
)
router.post('/backend-send-media', checkDestination, controllers.sendMedia)
router.post('/backend-send-text', checkDestination, controllers.sendText)
router.post('/backend-getgroups', controllers.fetchGroups)
router.post('/backend-blast', checkConnectionBeforeBlast, sendBlastMessage)
router.post('/backend-clearCache', async (_0x2f39e5, _0x121ecd) => {
  return (
    await cache.myCache.flushAll(),
    console.log('Cache cleared'),
    _0x121ecd.json({ status: 'success' })
  )
})
module.exports = router
