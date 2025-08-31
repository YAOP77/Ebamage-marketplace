require("dotenv").config();
const { TransactionalEmailsApi, SendSmtpEmail } = require("@getbrevo/brevo");

const emailAPI = new TransactionalEmailsApi();
emailAPI.authentications.apiKey.apiKey = process.env.BREVO_API_KEY;

const sendOtpEmail = async (toEmail, otp) => {
  const message = new SendSmtpEmail();
  message.subject = "Votre code OTP";
  message.htmlContent = `<p>Votre code OTP est <strong style="color: red">${otp}</strong>. Il expire dans 5 minutes.</p><br /><br />
  <p>Si les 5 minutes ont expiré, vous pouvez demander un autre code de confirmation</p>`;
  message.sender = { name: "Ebamage MarketPlace", email: "yaopascal11@gmail.com" };
  message.to = [{ email: toEmail }];

  try {
    const response = await emailAPI.sendTransacEmail(message);
    // console.log("Email envoyé avec succès:", response);
    return response;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    throw error;
  }
}

module.exports = sendOtpEmail;