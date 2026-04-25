import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const { email, client, item, price, qty, image } = req.body;

    // ✅ Gmail SMTP 설정
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // ✅ base64 이미지 처리
    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    // ✅ 메일 발송
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "견적서",

      // 👉 본문 (네이버 대응 안내 포함)
      html: `
        <h2>견적서</h2>
        <p><strong>수신처</strong> : ${client}</p>
        <p>아래 견적서를 확인해주세요.</p>

        <p style="color:red; font-size:14px;">
          ※ 일부 메일(네이버 등)에서는 이미지가 보이지 않을 수 있습니다.<br>
          첨부파일을 확인해주세요.
        </p>

        <img src="cid:quoteimg" style="width:100%; max-width:600px; border:1px solid #ddd;"/>
      `,

      // 👉 첨부 + 본문 표시용
      attachments: [
        {
          filename: "견적서.png",
          content: base64Data,
          encoding: "base64",
          cid: "quoteimg"
        }
      ]
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("메일 발송 오류:", err);
    res.status(500).json({ success: false, error: err.message });
  }
}
