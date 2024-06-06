const express = require("express");
const messageService = require("../services/message-service");
const router = express.Router();

router.get("/messages/:id", async(req, res) => {
  const {id} = req.params;
  return res.send([
    // {from: id, text: "Howdy"},
  ]);
});

router.post("/messages/send", async(req, res) => {
  return res.send(await messageService.getReply({Body: req.body.text, From: req.body.from}));
});

module.exports = router;