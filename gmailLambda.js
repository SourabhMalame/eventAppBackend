const nodemailer = require("nodemailer");

exports.sendMailLambda = async (event) => {
  const { name, email, message } = JSON.parse(event.body);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const staffMessage = `You have recieved mail from ${name} at ${email} \n\n ${message}`;

  const staffMail = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_STAFF,
    subject: "New Message from Contact Form",
    text: staffMessage,
  };

  const userMessage = `Thanks for contacting us , ${name}! \n\n We will get to you shortly `;

  const userMail = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Thank you for contacting us",
    text: userMessage,
  };

  try {
    await transporter.sendMail(staffMail);
  } catch (err) {
    console.log(err.message);
  }
  try {
    await transporter.sendMail(userMail);
  } catch (err) {
    console.log(err.message);
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Message sent successfully" }),
  };
};
