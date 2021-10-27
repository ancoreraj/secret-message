const express = require('express');
const router = express.Router();
const generateUID = require('./../config/secretId')
const User = require('./../models/User')
// Welcome Page

router.get('/', (req, res) => {
  let flashMsg = ''
  res.render('pages/home', { flashMsg })
});

router.post('/create-link', (req, res) => {

  try {
    const name = req.body.name
    const inboxSecret = generateUID()
    const messageSecret = generateUID()

    const newUser = new User({
      name,
      inboxSecret,
      messageSecret,
    })

    console.log(name, inboxSecret, messageSecret)

    newUser.save((err) => {
      if (err) {
        return res.render('error', { message: 'Internal Server error' })
      } else {
        res.redirect(`/inbox/${inboxSecret}`)
      }
    })

  } catch (err) {
    console.log(err)
  }


});

router.get('/inbox/:inboxSecret', async (req, res) => {
  try {
    const { inboxSecret } = req.params

    const findUser = await User.findOne({ inboxSecret })

    let whatsappLink = `whatsapp://send?text=Send Secret Message to ${findUser.name}. I will never know who sent me this message. Its really fun. Try here https://sendsecretmessage.herokuapp.com/message/${findUser.messageSecret}`

    console.log(whatsappLink)

    if (!findUser) {
      return res.render('error', { message: 'User Not found' })
    }

    res.render('pages/inbox', { findUser, whatsappLink })

  }catch(err){
    console.log(err)
  }
  

})

router.get('/message/:messageSecret', async (req, res) => {
  const { messageSecret } = req.params

  const findUser = await User.findOne({ messageSecret })

  if (!findUser) {
    return res.render('error', { message: 'User Not found' })
  }

  res.render('pages/message', { findUser })

})

router.post('/send-message/:messageSecret', async (req, res) => {
  const { messageSecret } = req.params
  const { message } = req.body

  const findUser = await User.findOne({ messageSecret })

  if (!findUser) {
    return res.render('error', { message: 'User Not found' })
  }

  findUser.messages.push(message)
  findUser.save((err) => {
    if (err) {
      return res.render('error', { message: 'Internal Server error' })
    } else {
      let flashMsg = 'Message send Successfully, Now create your own Link.'
      res.render('pages/home', { flashMsg })
    }
  })

})

module.exports = router;
