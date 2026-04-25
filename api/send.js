import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const { email, client, item, price, qty, image } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 👉 base64 이미지 처리
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "견적서",

      // ✅ 본문에 이미지 포함
      html: `
        <h2>견적서</h2>
        <p>수신처: ${client}</p>
        <p>아래 견적서를 확인해주세요.</p>
        <img src="cid:quoteimg" style="width:100%; max-width:600px;"/>
      `,

      // ✅ 첨부 + 본문 표시용
      attachments: [
        {
          filename: "견적서.png",
          content: base64Data,
          encoding: "base64",
          cid: "quoteimg" // 👈 이게 핵심
        }
      ]
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
