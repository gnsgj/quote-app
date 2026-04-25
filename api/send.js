import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const { email, client, item, price, qty, image } = req.body;

    // 👉 메일 서버 설정 (Gmail)
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // 👉 base64 이미지 처리 (캡쳐된 견적서)
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // 👉 메일 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "견적서",
      html: `
        <h2>견적서</h2>
        <p>수신처: ${client}</p>
        <p>항목: ${item}</p>
        <p>수량: ${qty}</p>
        <p>단가: ${price}</p>
        <p>첨부된 견적서를 확인해주세요.</p>
      `,
      attachments: [
        {
          filename: "견적서.png",
          content: base64Data,
          encoding: "base64"
        }
      ]
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("메일 발송 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
