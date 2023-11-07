const { dbQuery } = require('../database'),
  wa = require('../whatsapp'),
  sendBlastMessage = async (_0x1879f7, _0x5ddd71) => {
    const _0x3b5e86 = JSON.parse(_0x1879f7.body.data),
      _0x286e5d = _0x3b5e86.data
    let _0x260b89 = [],
      _0x505984 = []
    const _0x24663e = (_0x4c8f93) =>
        new Promise((_0x5828a9) => setTimeout(_0x5828a9, _0x4c8f93)),
      _0x5a649d = async () => {
        let _0x3891e0 = []
        for (let _0x43f676 in _0x286e5d) {
          const _0xc2dd0c = _0x3b5e86.delay
          await _0x24663e(_0xc2dd0c * 1000)
          if (
            _0x3b5e86.sender &&
            _0x286e5d[_0x43f676].receiver &&
            _0x286e5d[_0x43f676].message
          ) {
            const _0x3ff4cd = await dbQuery(
              "SELECT status FROM blasts WHERE receiver = '" +
                _0x286e5d[_0x43f676].receiver +
                "' AND campaign_id = '" +
                _0x3b5e86.campaign_id +
                "'"
            )
            if (_0x3ff4cd.length > 0) {
              if (_0x3ff4cd[0].status == 'pending') {
                const _0x10cd57 = wa
                  .sendMessage(
                    _0x3b5e86.sender,
                    _0x286e5d[_0x43f676].receiver,
                    _0x286e5d[_0x43f676].message
                  )
                  .then((_0x29731e) => {
                    _0x29731e
                      ? _0x260b89.push(_0x286e5d[_0x43f676].receiver)
                      : _0x505984.push(_0x286e5d[_0x43f676].receiver)
                  })
                _0x3891e0.push(_0x10cd57)
              } else {
                console.log('blast tidak pending, tidak dikirim!')
              }
            }
          } else {
            _0x505984.push(_0x286e5d[_0x43f676].receiver)
          }
        }
        return await Promise.all(_0x3891e0), true
      }
    let _0x59dc7d = await _0x5a649d()
    return _0x59dc7d
      ? _0x5ddd71.send({
          status: true,
          success: _0x260b89,
          failed: _0x505984,
        })
      : _0x5ddd71.send({
          status: false,
          message: 'Failed to send blast message',
        })
  }
module.exports = { sendBlastMessage: sendBlastMessage }
