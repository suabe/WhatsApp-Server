const {
  default: makeWASocket,
  downloadContentFromMessage,
} = require('@whiskeysockets/baileys')
function formatReceipt(_0xb507e6) {
  try {
    if (_0xb507e6.endsWith('@g.us')) {
      return _0xb507e6
    }
    let _0x3934f8 = _0xb507e6.replace(/\D/g, '')
    return (
      _0x3934f8.startsWith('0') && (_0x3934f8 = '62' + _0x3934f8.substr(1)),
      !_0x3934f8.endsWith('@c.us') && (_0x3934f8 += '@c.us'),
      _0x3934f8
    )
  } catch (_0x9ab621) {
    return _0xb507e6
  }
}
async function asyncForEach(_0x1b1b1e, _0x21313d) {
  for (let _0x43a93e = 0; _0x43a93e < _0x1b1b1e.length; _0x43a93e++) {
    await _0x21313d(_0x1b1b1e[_0x43a93e], _0x43a93e, _0x1b1b1e)
  }
}
async function removeForbiddenCharacters(_0x39e7bc) {
  return _0x39e7bc.replace(/[^a-zA-Z0-9 #\/:\.\-]/g, '')
}
async function parseIncomingMessage(_0x22281d) {
  const _0xcf0fd7 = Object.keys(_0x22281d.message || {})[0],
    _0xf5a83c =
      _0xcf0fd7 === 'conversation' && _0x22281d.message.conversation
        ? _0x22281d.message.conversation
        : _0xcf0fd7 == 'imageMessage' && _0x22281d.message.imageMessage.caption
        ? _0x22281d.message.imageMessage.caption
        : _0xcf0fd7 == 'videoMessage' && _0x22281d.message.videoMessage.caption
        ? _0x22281d.message.videoMessage.caption
        : _0xcf0fd7 == 'extendedTextMessage' &&
          _0x22281d.message.extendedTextMessage.text
        ? _0x22281d.message.extendedTextMessage.text
        : _0xcf0fd7 == 'messageContextInfo' &&
          _0x22281d.message.listResponseMessage?.title
        ? _0x22281d.message.listResponseMessage.title
        : _0xcf0fd7 == 'messageContextInfo'
        ? _0x22281d.message.buttonsResponseMessage.selectedDisplayText
        : '',
    _0x5afe5a = _0xf5a83c.toLowerCase(),
    _0x49c75d = await removeForbiddenCharacters(_0x5afe5a),
    _0xc2d679 = _0x22281d?.pushName || '',
    _0x1e32f7 = _0x22281d.key.remoteJid.split('@')[0]
  let _0x2acf24
  if (_0xcf0fd7 === 'imageMessage') {
    const _0x240974 = await downloadContentFromMessage(
      _0x22281d.message.imageMessage,
      'image'
    )
    let _0x46d46e = Buffer.from([])
    for await (const _0x408ab3 of _0x240974) {
      _0x46d46e = Buffer.concat([_0x46d46e, _0x408ab3])
    }
    _0x2acf24 = _0x46d46e.toString('base64')
  } else {
    urlImage = null
  }
  return {
    command: _0x49c75d,
    bufferImage: _0x2acf24,
    from: _0x1e32f7,
  }
}
module.exports = {
  formatReceipt: formatReceipt,
  asyncForEach: asyncForEach,
  removeForbiddenCharacters: removeForbiddenCharacters,
  parseIncomingMessage: parseIncomingMessage,
}
