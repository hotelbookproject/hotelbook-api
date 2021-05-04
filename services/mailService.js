const sgMail = require("@sendgrid/mail");

module.exports = function (userEmail,resetToken) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: userEmail,
    from: "nithinjoyapp@gmail.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `<strong>This is your reset token ${resetToken}</strong>`,
  };

  // sgMail
  // .send(msg)
  // .then(() => {
  //   console.log('Email sent')
  // })
  // .catch((error) => {
  //   console.error(error)
  // })

  (async () => {
    try {
      await sgMail.send(msg);
    } catch (error) {
      console.error(error);

      if (error.response) {
        console.error(error.response.body);
      }
    }
  })();
};
