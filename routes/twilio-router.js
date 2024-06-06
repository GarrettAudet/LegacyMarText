const express = require("express");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const messageService = require("../services/message-service");
const router = express.Router();

router.post("/sms/reply", async(req, res) => {
  const twiml = new MessagingResponse();

  const {messages} = await messageService.getReply(req.body);
  twiml.message(messages.join("\n"));
  return res.type("text/xml").send(twiml.toString());
});


module.exports = router;