'use strict'
const wa = require('../whatsapp'),
  createInstance = async (_0x5bf21e, _0x4cb2c8) => {
    const { token: _0x584aa3 } = _0x5bf21e.body
    if (_0x584aa3) {
      try {
        const _0x3ac5b7 = await wa.connectToWhatsApp(_0x584aa3, _0x5bf21e.io),
          _0x1e1b54 = _0x3ac5b7?.status,
          _0x3ddbd5 = _0x3ac5b7?.message
        return _0x4cb2c8.send({
          status: _0x1e1b54 ?? 'processing',
          qrcode: _0x3ac5b7?.qrcode,
          message: _0x3ddbd5 ? _0x3ddbd5 : 'Processing',
        })
      } catch (_0x527cbc) {
        return (
          console.log(_0x527cbc),
          _0x4cb2c8.send({
            status: false,
            error: _0x527cbc,
          })
        )
      }
    }
    _0x4cb2c8.status(403).end('Token needed')
  },
  sendText = async (_0x4c72a3, _0x421d8e) => {
    const {
      token: _0x58cb0a,
      number: _0x1f6cd2,
      text: _0x3b223f,
    } = _0x4c72a3.body
    if (_0x58cb0a && _0x1f6cd2 && _0x3b223f) {
      const _0x2b6825 = await wa.sendText(_0x58cb0a, _0x1f6cd2, _0x3b223f)
      return handleResponSendMessage(_0x2b6825, _0x421d8e)
    }
    _0x421d8e.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendMedia = async (_0x813288, _0x44a804) => {
    const {
      token: _0x28b016,
      number: _0x3c9657,
      type: _0x43f972,
      url: _0x4f620b,
      caption: _0x28c995,
      ptt: _0x2863a8,
      filename: _0x4f99bd,
    } = _0x813288.body
    if (_0x28b016 && _0x3c9657 && _0x43f972 && _0x4f620b) {
      const _0x5d1bd3 = await wa.sendMedia(
        _0x28b016,
        _0x3c9657,
        _0x43f972,
        _0x4f620b,
        _0x28c995 ?? '',
        _0x2863a8,
        _0x4f99bd
      )
      return handleResponSendMessage(_0x5d1bd3, _0x44a804)
    }
    _0x44a804.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendButtonMessage = async (_0x3cea73, _0xc7e4be) => {
    const {
        token: _0xf10033,
        number: _0x3bddff,
        button: _0x259d30,
        message: _0x533261,
        footer: _0x356582,
        image: _0xf0d161,
      } = _0x3cea73.body,
      _0x52dcf4 = JSON.parse(_0x259d30)
    if (_0xf10033 && _0x3bddff && _0x259d30 && _0x533261) {
      const _0x2ceb9f = await wa.sendButtonMessage(
        _0xf10033,
        _0x3bddff,
        _0x52dcf4,
        _0x533261,
        _0x356582,
        _0xf0d161
      )
      return handleResponSendMessage(_0x2ceb9f, _0xc7e4be)
    }
    _0xc7e4be.send({
      status: false,
      message: 'Check your parameterr',
    })
  },
  sendTemplateMessage = async (_0x348566, _0x1dfc1b) => {
    const {
      token: _0x3a79cb,
      number: _0x3fa706,
      button: _0x253564,
      text: _0x185e3d,
      footer: _0x39912b,
      image: _0x5c1fbb,
    } = _0x348566.body
    if (_0x3a79cb && _0x3fa706 && _0x253564 && _0x185e3d && _0x39912b) {
      const _0x1cf79b = await wa.sendTemplateMessage(
        _0x3a79cb,
        _0x3fa706,
        JSON.parse(_0x253564),
        _0x185e3d,
        _0x39912b,
        _0x5c1fbb
      )
      return handleResponSendMessage(_0x1cf79b, _0x1dfc1b)
    }
    _0x1dfc1b.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  sendListMessage = async (_0x3a8322, _0x23407b) => {
    const {
      token: _0x53bfa5,
      number: _0x2a9a1e,
      list: _0x175df3,
      text: _0x374ae8,
      footer: _0x394adc,
      title: _0x436639,
      buttonText: _0x2a602f,
    } = _0x3a8322.body
    if (
      _0x53bfa5 &&
      _0x2a9a1e &&
      _0x175df3 &&
      _0x374ae8 &&
      _0x436639 &&
      _0x2a602f
    ) {
      const _0x307f4f = await wa.sendListMessage(
        _0x53bfa5,
        _0x2a9a1e,
        JSON.parse(_0x175df3),
        _0x374ae8,
        _0x394adc ?? '',
        _0x436639,
        _0x2a602f
      )
      return handleResponSendMessage(_0x307f4f, _0x23407b)
    }
    _0x23407b.send({
      status: false,
      message: 'Check your parameterr',
    })
  },
  fetchGroups = async (_0x4face2, _0x3fd7df) => {
    const { token: _0x4540d3 } = _0x4face2.body
    if (_0x4540d3) {
      const _0xdc0c4a = await wa.fetchGroups(_0x4540d3)
      return handleResponSendMessage(_0xdc0c4a, _0x3fd7df)
    }
    _0x3fd7df.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  deleteCredentials = async (_0x1a72b2, _0x129d49) => {
    const { token: _0x242723 } = _0x1a72b2.body
    if (_0x242723) {
      const _0x1b929c = await wa.deleteCredentials(_0x242723)
      return handleResponSendMessage(_0x1b929c, _0x129d49)
    }
    _0x129d49.send({
      status: false,
      message: 'Check your parameter',
    })
  },
  handleResponSendMessage = (_0x25fb78, _0x226751, _0x4421b8 = null) => {
    if (_0x25fb78) {
      return _0x226751.send({
        status: true,
        data: _0x25fb78,
      })
    }
    return _0x226751.send({
      status: false,
      message: 'Check your whatsapp connection',
    })
  }
module.exports = {
  createInstance: createInstance,
  sendText: sendText,
  sendMedia: sendMedia,
  sendButtonMessage: sendButtonMessage,
  sendTemplateMessage: sendTemplateMessage,
  sendListMessage: sendListMessage,
  deleteCredentials: deleteCredentials,
  fetchGroups: fetchGroups,
}
