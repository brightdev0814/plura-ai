const express = require("express");
const router = express.Router();
const LeadCtrl = require("../ctrls/LeadCtrl");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.post("/tiktok-webhook", LeadCtrl.validate);

module.exports = router;
