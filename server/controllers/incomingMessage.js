const { dbQuery } = require('../database/index'),
  { parseIncomingMessage } = require('../lib/helper')
require('dotenv').config()
const axios = require('axios'),
  {
    isExistsEqualCommand,
    isExistsContainCommand,
    getUrlWebhook,
  } = require('../database/model'),
  IncomingMessage = async (_0x1f20a0, _0x52dd4a) => {
    try {
      let _0x406e25 = false
      if (!_0x1f20a0.messages) {
        return
      }
      _0x1f20a0 = _0x1f20a0.messages[0]
      const _0x357af7 = _0x1f20a0?.pushName || ''
      if (_0x1f20a0.key.fromMe === true) {
        return
      }
      if (_0x1f20a0.key.remoteJid === 'status@broadcast') {
        return
      }
      const {
        command: _0x71d7b7,
        bufferImage: _0x212791,
        from: _0x23143c,
      } = await parseIncomingMessage(_0x1f20a0)
      let _0x3a8121, _0x2624c9
      const _0xb73c49 = _0x52dd4a.user.id.split(':')[0],
        _0x1b0ee1 = await isExistsEqualCommand(_0x71d7b7, _0xb73c49)
      _0x1b0ee1.length > 0
        ? (_0x2624c9 = _0x1b0ee1)
        : (_0x2624c9 = await isExistsContainCommand(_0x71d7b7, _0xb73c49))
      if (_0x2624c9.length === 0) {
        const _0x27da60 = await getUrlWebhook(_0xb73c49)
        if (_0x27da60 == null) {
          return
        }
        const _0x1ecca4 = await sendWebhook({
          command: _0x71d7b7,
          bufferImage: _0x212791,
          from: _0x23143c,
          url: _0x27da60,
        })
        if (_0x1ecca4 === false) {
          return
        }
        if (_0x1ecca4 === undefined) {
          return
        }
        if (typeof _0x1ecca4 != 'object') {
          return
        }
        _0x406e25 = _0x1ecca4?.quoted ? true : false
        _0x3a8121 = JSON.stringify(_0x1ecca4)
      } else {
        replyorno =
          _0x2624c9[0].reply_when == 'All'
            ? true
            : _0x2624c9[0].reply_when == 'Group' &&
              _0x1f20a0.key.remoteJid.includes('@g.us')
            ? true
            : _0x2624c9[0].reply_when == 'Personal' &&
              !_0x1f20a0.key.remoteJid.includes('@g.us')
            ? true
            : false
        if (replyorno === false) {
          return
        }
        _0x406e25 = _0x2624c9[0].is_quoted ? true : false
        _0x3a8121 =
          process.env.TYPE_SERVER === 'hosting'
            ? _0x2624c9[0].reply
            : JSON.stringify(_0x2624c9[0].reply)
      }
      b = (JSON.parse(_0x3a8121)).text
      return (
        (_0x3a8121 = _0x3a8121.replace(/{name}/g, _0x357af7)),
        await _0x52dd4a
          .sendMessage(_0x1f20a0.key.remoteJid, JSON.parse(_0x3a8121), {
            quoted: _0x406e25 ? _0x1f20a0 : null,
          })
          .catch((_0x5ba400) => {
            console.log(_0x5ba400)
          }),
        true
      )
    } catch (_0x2e0086) {
      console.log(_0x2e0086)
    }
  }
async function sendWebhook({
  command: _0x12f7a1,
  bufferImage: _0x1d3f26,
  from: _0x28c156,
  url: _0x254b2f,
}) {
  try {
    const _0x9a3967 = {
        message: _0x12f7a1,
        bufferImage: _0x1d3f26 == undefined ? null : _0x1d3f26,
        from: _0x28c156,
      },
      _0x157144 = { 'Content-Type': 'application/json; charset=utf-8' },
      _0xa4a588 = await axios
        .post(_0x254b2f, _0x9a3967, _0x157144)
        .catch(() => {
          return false
        })
    return _0xa4a588.data
  } catch (_0x48f002) {
    return console.log('error send webhook', _0x48f002), false
  }
}
module.exports = { IncomingMessage: IncomingMessage }
