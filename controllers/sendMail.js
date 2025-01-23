const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: "nilawarpranav4@gmail.com",
        pass: "sziosnoxbpdrmtkt"
    },
});

async function sendMail(to) {
    const info = await transporter.sendMail({
        from: "nilawarpranav4@gmail.com",
        to,
        subject: "Node JS Testing Mail",
        text: "Test Content Using Node JS",
    })
}

module.exports = {sendMail};