const axios = require("axios");
const crypto = require("crypto");

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidPhone = (phone) => {
  const regex =
    /^(\+1\s?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})([\s.-]?)?[0-9]{3}([\s.-]?)?[0-9]{4}$/;
  return regex.test(phone);
};

const toE164 = (phone) => {
  return phone.replace(/\D/g, "");
};

const handleTiktokWebhook = async (req, res) => {
  try {
    // const lead = {
    //   ad_group_name: "test lead: dummy data for ad group name",
    //   ad_id: "0",
    //   ad_name: "test lead: dummy data for ad name",
    //   age: "35-44",
    //   campaign_id: "0",
    //   campaign_name: "test lead: dummy data for campaign name",
    //   created_at: "2025-10-02 18:48:22",
    //   credit_score: "Fair (650-699)",
    //   disclaimer:
    //     "By checking this box and providing your phone number, you consent to receive marketing calls and texts from Solvable.com and our partners regarding auto insurance quotes, even if your number is on a Do Not Call registry. You understand that consent is not required as a condition of purchase. Message and data rates may apply. You can opt out at any time by replying STOP.",
    //   email: "vishaal.melwani@adquadrant.com",
    //   first_name: "Vishaal",
    //   last_name: "Melwani",
    //   phone: "+1 702-249-7036",
    //   homeowner: "Yes",
    //   insured: "Yes",
    //   lead_id: "7556696111797518608",
    //   tcpa_consent: "true",
    //   vehicles: "2",
    //   zipcode: "11201",
    // };
    const lead = req.body;
    if (!isValidEmail(lead.email)) {
      console.log("Invalid email address. Please enter a valid email.");
      return res.json({
        status: false,
        message: "Invalid email address. Please enter a valid email.",
      });
    } else if (!isValidPhone(lead.phone)) {
      console.log("Invalid phone number. Please enter a valid phone number.");
      return res.json({
        status: false,
        message: "Invalid phone number. Please enter a valid phone number.",
      });
    } else {
      try {
        // const { data } = await axios.post(
        //   "https://api.plura.ai/v1/agent",
        //   {
        //     agent: process.env.PLURA_AGENT,
        //     phone: lead.phone,
        //     from: process.env.PLURA_PHONE,
        //     request_data: lead,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${process.env.PLURA_API_KEY}`,
        //     },
        //   }
        // );
        // return res.json({
        //   data: data,
        //   status: true,
        // });

        const { data } = await axios.post(
          "https://api.plura.ai/v1/lead/sendtoworkflow",
          {
            workflow_id: process.env.PLURA_WORKFLOW_ID,
            record: {
              ...lead,
              phone: toE164(lead.phone),
            },
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.PLURA_API_KEY}`,
            },
          }
        );
        return res.json({
          data: data,
          status: true,
        });
      } catch (err) {
        return res.json({
          status: false,
          message: err.message,
        });
      }
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

const handlePluraWebhook = async (req, res) => {
  console.log(req.body);
  return res.json({
    data: req.body,
    status: true,
  });
};

module.exports = {
  handleTiktokWebhook,
  handlePluraWebhook,
};
