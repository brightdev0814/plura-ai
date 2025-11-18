const express = require("express");
const router = express.Router();
const LeadCtrl = require("../ctrls/LeadCtrl");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/tiktok-webhook", LeadCtrl.handleTiktokWebhook);
router.post("/tiktok-webhook-v5", LeadCtrl.handlePluraWebhookV5);
router.post("/plura-webhook", LeadCtrl.handlePluraWebhook);
module.exports = router;
