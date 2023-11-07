'use strict'
  const _ = require('lodash'),
  { Boom } = require('@hapi/boom'),
  { default: makeWASocket } = require('@whiskeysockets/baileys'),
  {
    fetchLatestBaileysVersion,
    getDevice,
    useMultiFileAuthState,
    makeCacheableSignalKeyStore,
  } = require('@whiskeysockets/baileys'),
  { DisconnectReason } = require('@whiskeysockets/baileys'),
  QRCode = require('qrcode'),
  fs = require('fs')
  let sock = [],
  qrcode = [],
  intervalStore = []
  const { setStatus } = require('./database/index'),
  { IncomingMessage } = require('./controllers/incomingMessage'),
  { formatReceipt } = require('./lib/helper'),
  axios = require('axios'),
  MAIN_LOGGER = require('./lib/pino'),
  logger = MAIN_LOGGER.child({}),
  connectToWhatsApp = async (_0xa603ac, _0x2763ef = null) => {
    if (typeof qrcode[_0xa603ac] !== 'undefined') {
      return (
        _0x2763ef !== null &&
          _0x2763ef.emit('qrcode', {
            token: _0xa603ac,
            data: qrcode[_0xa603ac],
            message: 'please scan with your Whatsapp Account',
          }),
        {
          status: false,
          sock: sock[_0xa603ac],
          qrcode: qrcode[_0xa603ac],
          message: 'Please scann qrcode',
        }
      )
    }
    try {
      let _0x5b090a = sock[_0xa603ac].user.id.split(':')
      _0x5b090a = _0x5b090a[0] + '@s.whatsapp.net'
      const _0x2b6392 = await getPpUrl(_0xa603ac, _0x5b090a)
      return (
        _0x2763ef !== null &&
          (_0x2763ef.emit('connection-open', {
            token: _0xa603ac,
            user: sock[_0xa603ac].user,
            ppUrl: _0x2b6392,
          }),
          console.log(sock[_0xa603ac].user)),
        {
          status: true,
          message: 'Already connected',
        }
      )
    } catch (_0x38ae90) {
      _0x2763ef !== null &&
        _0x2763ef.emit('message', {
          token: _0xa603ac,
          message: 'Connecting.. (1)',
        })
    }
    const { version: _0x13c422, isLatest: _0x30bbb8 } =
      await fetchLatestBaileysVersion()
    console.log(
      'You re using whatsapp gateway M Pedia v5.0.0 - Contact admin if any trouble : 082298859671'
    )
    console.log('using WA v' + _0x13c422.join('.') + ', isLatest: ' + _0x30bbb8)
    const { state: _0x135cfd, saveCreds: _0x86f63 } =
      await useMultiFileAuthState('./credentials/' + _0xa603ac)
    return (
      (sock[_0xa603ac] = makeWASocket({
        version: _0x13c422,
        browser: ['AXI WAPI', 'Chrome', '114.0.5735.199'],
        logger: logger,
        printQRInTerminal: true,
        patchMessageBeforeSending: (_0x3afde1) => {
          const _0x5193b3 = Boolean(
            _0x3afde1?.buttonsMessage ||
              _0x3afde1?.templateMessage ||
              _0x3afde1?.listMessage
          )
          return (
            _0x3afde1?.templateMessage &&
              ((_0x3afde1.templateMessage.hydratedFourRowTemplate = _.cloneDeep(
                _0x3afde1.templateMessage.hydratedTemplate
              )),
              delete _0x3afde1.templateMessage.fourRowTemplate),
            _0x3afde1?.deviceSentMessage?.message?.templateMessage &&
              ((_0x3afde1.deviceSentMessage.message.templateMessage.hydratedFourRowTemplate =
                _.cloneDeep(
                  _0x3afde1.deviceSentMessage.message.templateMessage
                    .hydratedTemplate
                )),
              delete _0x3afde1.deviceSentMessage.message.templateMessage
                .fourRowTemplate),
            _0x5193b3 &&
              (_0x3afde1 = {
                viewOnceMessage: {
                  message: {
                    messageContextInfo: {
                      deviceListMetadataVersion: 2,
                      deviceListMetadata: {},
                    },
                    ..._0x3afde1,
                  },
                },
              }),
            _0x3afde1
          )
        },
        auth: {
          creds: _0x135cfd.creds,
          keys: makeCacheableSignalKeyStore(_0x135cfd.keys, logger),
        },
      })),
      sock[_0xa603ac].ev.process(async (_0x33b5b0) => {
        if (_0x33b5b0['connection.update']) {
          const _0x35b143 = _0x33b5b0['connection.update'],
            {
              connection: _0x98bf85,
              lastDisconnect: _0x488ce5,
              qr: _0x2ac933,
            } = _0x35b143
          if (_0x98bf85 === 'close') {
            if (
              (_0x488ce5?.error instanceof Boom)?.output?.statusCode !==
              DisconnectReason.loggedOut
            ) {
              delete qrcode[_0xa603ac]
              if (_0x2763ef != null) {
                _0x2763ef.emit('message', {
                  token: _0xa603ac,
                  message: 'Connecting..',
                })
              }
              if (
                _0x488ce5.error?.output?.payload?.message ===
                'QR refs attempts ended'
              ) {
                delete qrcode[_0xa603ac]
                sock[_0xa603ac].ws.close()
                if (_0x2763ef != null) {
                  _0x2763ef.emit('message', {
                    token: _0xa603ac,
                    message:
                      'Request QR ended. reload scan to request QR again',
                  })
                }
                return
              }
              _0x488ce5?.error.output.payload.message !=
                'Stream Errored (conflict)' &&
                connectToWhatsApp(_0xa603ac, _0x2763ef)
            } else {
              setStatus(_0xa603ac, 'Disconnect')
              console.log('Connection closed. You are logged out.')
              _0x2763ef !== null &&
                _0x2763ef.emit('message', {
                  token: _0xa603ac,
                  message: 'Connection closed. You are logged out.',
                })
              clearConnection(_0xa603ac)
            }
          }
          _0x2ac933 &&
            QRCode.toDataURL(_0x2ac933, function (_0x2d4358, _0x4fdca8) {
              _0x2d4358 && console.log(_0x2d4358)
              qrcode[_0xa603ac] = _0x4fdca8
              _0x2763ef !== null &&
                _0x2763ef.emit('qrcode', {
                  token: _0xa603ac,
                  data: _0x4fdca8,
                  message: 'Please scan with your Whatsapp Account',
                })
            })
          if (_0x98bf85 === 'open') {
            setStatus(_0xa603ac, 'Connected')
            let _0x78ff40 = sock[_0xa603ac].user.id.split(':')
            _0x78ff40 = _0x78ff40[0] + '@s.whatsapp.net'
            const _0x5382e7 = await getPpUrl(_0xa603ac, _0x78ff40)
            _0x2763ef !== null &&
              _0x2763ef.emit('connection-open', {
                token: _0xa603ac,
                user: sock[_0xa603ac].user,
                ppUrl: _0x5382e7,
              })
            delete qrcode[_0xa603ac]
          }
        }
        if (_0x33b5b0['messages.upsert']) {
          const _0xfe3dfc = _0x33b5b0['messages.upsert']
          IncomingMessage(_0xfe3dfc, sock[_0xa603ac])
        }
        if (_0x33b5b0['creds.update']) {
          const _0x3747fc = _0x33b5b0['creds.update']
          _0x86f63(_0x3747fc)
        }
      }),
      {
        sock: sock[_0xa603ac],
        qrcode: qrcode[_0xa603ac],
      }
    )
  }
async function connectWaBeforeSend(_0x47357b) {
  let _0x352aa0 = undefined,
    _0x13a8cd
  _0x13a8cd = await connectToWhatsApp(_0x47357b)
  await _0x13a8cd.sock.ev.on('connection.update', (_0x33e7b0) => {
    const { connection: _0x5e1fe3, qr: _0x3567e9 } = _0x33e7b0
    _0x5e1fe3 === 'open' && (_0x352aa0 = true)
    _0x3567e9 && (_0x352aa0 = false)
  })
  let _0x1ac97c = 0
  while (typeof _0x352aa0 === 'undefined') {
    _0x1ac97c++
    if (_0x1ac97c > 4) {
      break
    }
    await new Promise((_0x20fa2d) => setTimeout(_0x20fa2d, 1000))
  }
  return _0x352aa0
}
const sendText = async (_0x58bcfe, _0x2015a6, _0x26f6d0) => {
    try {
      const _0x2db8d7 = await sock[_0x58bcfe].sendMessage(
        formatReceipt(_0x2015a6),
        { text: _0x26f6d0 }
      )
      return console.log(_0x2db8d7), _0x2db8d7
    } catch (_0x1a0b52) {
      return console.log(_0x1a0b52), false
    }
  },
  sendMessage = async (_0x17eaff, _0x270c69, _0x26ab21) => {
    try {
      const _0x37bca7 = await sock[_0x17eaff].sendMessage(
        formatReceipt(_0x270c69),
        JSON.parse(_0x26ab21)
      )
      return _0x37bca7
    } catch (_0x355a6f) {
      return console.log(_0x355a6f), false
    }
  }
async function sendMedia(
  _0x4a7470,
  _0xa6920a,
  _0x46b73e,
  _0x152f26,
  _0x24827c,
  _0x34ca94,
  _0x1f964c
) {
  const _0x1758b1 = formatReceipt(_0xa6920a)
  try {
    if (_0x46b73e == 'image') {
      var _0x3de41f = await sock[_0x4a7470].sendMessage(_0x1758b1, {
        image: _0x152f26
          ? { url: _0x152f26 }
          : fs.readFileSync('src/public/temp/' + fileName),
        caption: _0x24827c ? _0x24827c : null,
      })
    } else {
      if (_0x46b73e == 'video') {
        var _0x3de41f = await sock[_0x4a7470].sendMessage(_0x1758b1, {
          video: _0x152f26
            ? { url: _0x152f26 }
            : fs.readFileSync('src/public/temp/' + _0x1f964c),
          caption: _0x24827c ? _0x24827c : null,
        })
      } else {
        if (_0x46b73e == 'audio') {
          var _0x3de41f = await sock[_0x4a7470].sendMessage(_0x1758b1, {
            audio: _0x152f26
              ? { url: _0x152f26 }
              : fs.readFileSync('src/public/temp/' + _0x1f964c),
            ptt: _0x34ca94 == 0 ? false : true,
            mimetype: 'audio/mpeg',
          })
        } else {
          if (_0x46b73e == 'pdf') {
            var _0x3de41f = await sock[_0x4a7470].sendMessage(
              _0x1758b1,
              {
                document: { url: _0x152f26 },
                mimetype: 'application/pdf',
                fileName: _0x1f964c + '.pdf',
              },
              { url: _0x152f26 }
            )
          } else {
            if (_0x46b73e == 'xls') {
              var _0x3de41f = await sock[_0x4a7470].sendMessage(
                _0x1758b1,
                {
                  document: { url: _0x152f26 },
                  mimetype: 'application/excel',
                  fileName: _0x1f964c + '.xls',
                },
                { url: _0x152f26 }
              )
            } else {
              if (_0x46b73e == 'xlsx') {
                var _0x3de41f = await sock[_0x4a7470].sendMessage(
                  _0x1758b1,
                  {
                    document: { url: _0x152f26 },
                    mimetype:
                      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    fileName: _0x1f964c + '.xlsx',
                  },
                  { url: _0x152f26 }
                )
              } else {
                if (_0x46b73e == 'doc') {
                  var _0x3de41f = await sock[_0x4a7470].sendMessage(
                    _0x1758b1,
                    {
                      document: { url: _0x152f26 },
                      mimetype: 'application/msword',
                      fileName: _0x1f964c + '.doc',
                    },
                    { url: _0x152f26 }
                  )
                } else {
                  if (_0x46b73e == 'docx') {
                    var _0x3de41f = await sock[_0x4a7470].sendMessage(
                      _0x1758b1,
                      {
                        document: { url: _0x152f26 },
                        mimetype:
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                        fileName: _0x1f964c + '.docx',
                      },
                      { url: _0x152f26 }
                    )
                  } else {
                    if (_0x46b73e == 'zip') {
                      var _0x3de41f = await sock[_0x4a7470].sendMessage(
                        _0x1758b1,
                        {
                          document: { url: _0x152f26 },
                          mimetype: 'application/zip',
                          fileName: _0x1f964c + '.zip',
                        },
                        { url: _0x152f26 }
                      )
                    } else {
                      if (_0x46b73e == 'mp3') {
                        var _0x3de41f = await sock[_0x4a7470].sendMessage(
                          _0x1758b1,
                          {
                            document: { url: _0x152f26 },
                            mimetype: 'application/mp3',
                          },
                          { url: _0x152f26 }
                        )
                      } else {
                        return (
                          console.log('Please add your won role of mimetype'),
                          {
                            error: true,
                            message: 'Please add your won role of mimetype',
                          }
                        )
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    return _0x3de41f
  } catch (_0x20f15c) {
    return false
  }
}
async function sendButtonMessage(
  _0x31756e,
  _0x31d16b,
  _0x2b90ee,
  _0x2e2392,
  _0xcde09,
  _0x2d6fa2
) {
  let _0xe56327 = 'url'
  try {
    const _0x503522 = _0x2b90ee.map((_0x43cfe1, _0x456f1d) => {
      return {
        buttonId: _0x456f1d,
        buttonText: { displayText: _0x43cfe1.displayText },
        type: 1,
      }
    })
    if (_0x2d6fa2) {
      var _0x2d9b8e = {
        image:
          _0xe56327 == 'url'
            ? { url: _0x2d6fa2 }
            : fs.readFileSync('src/public/temp/' + _0x2d6fa2),
        caption: _0x2e2392,
        footer: _0xcde09,
        buttons: _0x503522,
        headerType: 4,
      }
    } else {
      var _0x2d9b8e = {
        text: _0x2e2392,
        footer: _0xcde09,
        buttons: _0x503522,
        headerType: 1,
      }
    }
    const _0x106feb = await sock[_0x31756e].sendMessage(
      formatReceipt(_0x31d16b),
      _0x2d9b8e
    )
    return _0x106feb
  } catch (_0x40898a) {
    return console.log(_0x40898a), false
  }
}
async function sendTemplateMessage(
  _0x298f1b,
  _0x340a4d,
  _0x5f8150,
  _0x4f7b34,
  _0xeec05d,
  _0x3a4e78
) {
  try {
    if (_0x3a4e78) {
      var _0x14a814 = {
        caption: _0x4f7b34,
        footer: _0xeec05d,
        viewOnce: true,
        templateButtons: _0x5f8150,
        image: { url: _0x3a4e78 },
      }
    } else {
      var _0x14a814 = {
        text: _0x4f7b34,
        footer: _0xeec05d,
        viewOnce: true,
        templateButtons: _0x5f8150,
      }
    }
    const _0x41b093 = await sock[_0x298f1b].sendMessage(
      formatReceipt(_0x340a4d),
      _0x14a814
    )
    return _0x41b093
  } catch (_0x18e27d) {
    return console.log(_0x18e27d), false
  }
}
async function sendListMessage(
  _0x5dca7c,
  _0x50cc28,
  _0x4f10c7,
  _0x2b93f3,
  _0x28477a,
  _0x17c6be,
  _0x834fd7
) {
  try {
    const _0xb4aa7f = {
        text: _0x2b93f3,
        footer: _0x28477a,
        title: _0x17c6be,
        buttonText: _0x834fd7,
        sections: [_0x4f10c7],
        viewOnce: true,
      },
      _0x51f483 = await sock[_0x5dca7c].sendMessage(
        formatReceipt(_0x50cc28),
        _0xb4aa7f,
        { ephemeralExpiration: 604800 }
      )
    return _0x51f483
  } catch (_0x1fe00d) {
    return console.log(_0x1fe00d), false
  }
}
async function fetchGroups(_0x51fe7d) {
  try {
    let _0x27fee0 = await sock[_0x51fe7d].groupFetchAllParticipating(),
      _0x3a1543 = Object.entries(_0x27fee0)
        .slice(0)
        .map((_0x244ddd) => _0x244ddd[1])
    return _0x3a1543
  } catch (_0x14b33e) {
    return false
  }
}
async function isExist(_0x58b591, _0x403c08) {
  if (typeof sock[_0x58b591] === 'undefined') {
    const _0x42cbe = await connectWaBeforeSend(_0x58b591)
    if (!_0x42cbe) {
      return false
    }
  }
  try {
    if (_0x403c08.includes('@g.us')) {
      return true
    } else {
      const [_0x3db311] = await sock[_0x58b591].onWhatsApp(_0x403c08)
      return _0x3db311
    }
  } catch (_0x542b39) {
    return false
  }
}
async function getPpUrl(_0x887334, _0x5a25c3, _0x4792bb) {
  let _0x10e73d
  try {
    return (
      (_0x10e73d = await sock[_0x887334].profilePictureUrl(_0x5a25c3)),
      _0x10e73d
    )
  } catch (_0x5416ee) {
    return 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/WhatsApp.svg/1200px-WhatsApp.svg.png'
  }
}
async function deleteCredentials(_0x5b58f6, _0x5933d4 = null) {
  _0x5933d4 !== null &&
    _0x5933d4.emit('message', {
      token: _0x5b58f6,
      message: 'Logout Progres..',
    })
  try {
    if (typeof sock[_0x5b58f6] === 'undefined') {
      const _0x53b09e = await connectWaBeforeSend(_0x5b58f6)
      _0x53b09e && (sock[_0x5b58f6].logout(), delete sock[_0x5b58f6])
    } else {
      sock[_0x5b58f6].logout()
      delete sock[_0x5b58f6]
    }
    return (
      delete qrcode[_0x5b58f6],
      clearInterval(intervalStore[_0x5b58f6]),
      setStatus(_0x5b58f6, 'Disconnect'),
      _0x5933d4 != null &&
        (_0x5933d4.emit('Unauthorized', _0x5b58f6),
        _0x5933d4.emit('message', {
          token: _0x5b58f6,
          message: 'Connection closed. You are logged out.',
        })),
      fs.existsSync('./credentials/' + _0x5b58f6) &&
        fs.rmSync(
          './credentials/' + _0x5b58f6,
          {
            recursive: true,
            force: true,
          },
          (_0x581660) => {
            if (_0x581660) {
              console.log(_0x581660)
            }
          }
        ),
      {
        status: true,
        message: 'Deleting session and credential',
      }
    )
  } catch (_0x4da945) {
    return (
      console.log(_0x4da945),
      {
        status: true,
        message: 'Nothing deleted',
      }
    )
  }
}
async function getChromeLates() {
  const _0x2259da = await axios.get(
    'https://versionhistory.googleapis.com/v1/chrome/platforms/linux/channels/stable/versions'
  )
  return _0x2259da
}
function clearConnection(_0x24aba3) {
  clearInterval(intervalStore[_0x24aba3])
  delete sock[_0x24aba3]
  delete qrcode[_0x24aba3]
  setStatus(_0x24aba3, 'Disconnect')
  fs.existsSync('./credentials/' + _0x24aba3) &&
    (fs.rmSync(
      './credentials/' + _0x24aba3,
      {
        recursive: true,
        force: true,
      },
      (_0x4b81b0) => {
        if (_0x4b81b0) {
          console.log(_0x4b81b0)
        }
      }
    ),
    console.log('credentials/' + _0x24aba3 + ' is deleted'))
}
async function initialize(_0xc4542d, _0x1223e3) {
  const { token: _0x206a73 } = _0xc4542d.body
  if (_0x206a73) {
    const _0x19a7b2 = require('fs'),
      _0x1368fc = './credentials/' + _0x206a73
    if (_0x19a7b2.existsSync(_0x1368fc)) {
      sock[_0x206a73] = undefined
      const _0x3da3d7 = await connectWaBeforeSend(_0x206a73)
      return _0x3da3d7
        ? _0x1223e3.status(200).json({
            status: true,
            message: 'Connection restored',
          })
        : _0x1223e3.status(200).json({
            status: false,
            message: 'Connection failed',
          })
    }
    return _0x1223e3.send({
      status: false,
      message: _0x206a73 + ' Connection failed,please scan first',
    })
  }
  return _0x1223e3.send({
    status: false,
    message: 'Wrong Parameterss',
  })
}
module.exports = {
  connectToWhatsApp: connectToWhatsApp,
  sendText: sendText,
  sendMedia: sendMedia,
  sendButtonMessage: sendButtonMessage,
  sendTemplateMessage: sendTemplateMessage,
  sendListMessage: sendListMessage,
  isExist: isExist,
  getPpUrl: getPpUrl,
  fetchGroups: fetchGroups,
  deleteCredentials: deleteCredentials,
  sendMessage: sendMessage,
  initialize: initialize,
  connectWaBeforeSend: connectWaBeforeSend,
}
