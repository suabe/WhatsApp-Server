const wa = require('../whatsapp'),
  { formatReceipt } = require('./helper'),
  checkDestination = async (_0x5dd443, _0x1305c8, _0x25990a) => {
    const { token: _0x77121b, number: _0x38c987 } = _0x5dd443.body
    if (_0x77121b && _0x38c987) {
      const _0x5a9f5d = await wa.isExist(_0x77121b, formatReceipt(_0x38c987))
      if (!_0x5a9f5d) {
        return _0x1305c8.send({
          status: false,
          message:
            'The destination Number not registered in WhatsApp or your sender not connected',
        })
      }
      _0x25990a()
    } else {
      _0x1305c8.send({
        status: false,
        message: 'Check your parameter',
      })
    }
  },
  checkConnectionBeforeBlast = async (_0x25a929, _0x556303, _0x5a0c06) => {
    const _0x156996 = JSON.parse(_0x25a929.body.data),
      _0x4b62fd = await wa.isExist(
        _0x156996.sender,
        formatReceipt(_0x156996.sender)
      )
    if (!_0x4b62fd) {
      return _0x556303.send({
        status: false,
        message: 'Check your whatsapp connection',
      })
    }
    _0x5a0c06()
  }
module.exports = {
  checkDestination: checkDestination,
  checkConnectionBeforeBlast: checkConnectionBeforeBlast,
}
