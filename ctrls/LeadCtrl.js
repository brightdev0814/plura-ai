const axios = require("axios");

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
        const { data: result } = await axios.get(
          `https://api.plura.ai/v1/lead/get?phone=${toE164(lead.phone)}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.PLURA_API_KEY}`,
            },
          }
        );
        if (result.status === "failed") {
          return res.json({
            status: false,
            message: "Lead with this phone number already exists.",
          });
        } else {
          const { data } = await axios.post(
            "https://api.plura.ai/v1/lead/sendtoworkflow",
            {
              workflow_id: process.env.PLURA_WORKFLOW_ID,
              record: {
                ad_id: lead?.ad_id,
                age: lead?.age,
                campaign_id: lead?.campaign_id,
                created_at: lead?.created_at,
                credit_score: lead?.credit_score,
                email: lead?.email,
                first_name: lead?.first_name,
                last_name: lead?.last_name,
                phone: toE164(lead?.phone),
                homeowner: lead?.homeowner,
                insured: lead?.insured,
                // lead_id: lead?.lead_id,
                tcpa_consent: lead?.tcpa_consent,
                vehicles: lead?.vehicles,
                zip_code: lead?.zipcode,
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
        }
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
  return res.json({
    data: req.body,
    status: true,
  });
};

module.exports = {
  handleTiktokWebhook,
  handlePluraWebhook,
};
