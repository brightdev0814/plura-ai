const axios = require("axios");
const crypto = require("crypto");

const getAnswer = (lead, key) => {
  return lead.answers.find((a) => a.question_key === key)?.answer;
};

const validateActivePropspect = async (certUrl, lead) => {
  try {
    const trustedformCertUrl = certUrl;
    if (!trustedformCertUrl) {
      throw {
        response: {
          data: "Missing cert URL",
        },
      };
    } else {
      const certId = trustedformCertUrl.split("/").pop();
      const email = getAnswer(lead, "email");
      const phone = getAnswer(lead, "phone");
      const { data } = await axios.post(
        `https://cert.trustedform.com/${certId}`,
        {
          match_lead: {
            email: email,
            phone: phone,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Api-Version": "4.0",
            Authorization:
              "Basic " +
              Buffer.from(
                `vishaal.melwani@adquadrant.com:${process.env.ACTIVE_PROSPECT_API_KEY}`
              ).toString("base64"),
          },
        }
      );

      return data;
    }
  } catch (err) {
    console.error(
      "ActiveProspect validation failed:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const validateNeustar = async (lead) => {
  try {
    const firstName = getAnswer(lead, "first_name");
    const lastName = getAnswer(lead, "last_name");
    const email = getAnswer(lead, "email");
    const phone = getAnswer(lead, "phone");
    const zip = getAnswer(lead, "zip_code");
    const { data } = await axios.post(
      `https://api.neustar.biz/validate/lead/phone?phone=${phone}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.NEUSTAR_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return data;
  } catch (err) {
    console.error(
      "Neustar validation failed:",
      err.response?.data || err.message
    );
    throw err;
  }
};

const validate = async (req, res) => {
  try {
    const trustedformCertUrl = req.body.trustedform_cert_url;
    const lead = req.body.leads.length > 0 ? req.body.leads[0] : null;

    const validateActiveProspectResult = await validateActivePropspect(
      trustedformCertUrl,
      lead
    );
    if (
      validateActiveProspectResult.match_lead.result.email_match &&
      validateActiveProspectResult.match_lead.result.phone_match
    ) {
      // await validateNeustar(lead);
      console.log(
        "ActivePropspect validation passed:",
        validateActiveProspectResult
      );
      return res.status(200).json({
        challenge: crypto.randomBytes(16).toString("hex"),
      });
    } else {
      console.error(
        "ActiveProspect validation failed:",
        validateActiveProspectResult.match_lead
      );
      throw {
        response: {
          data: "ActiveProspect validation failed.",
        },
      };
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  validate,
};
