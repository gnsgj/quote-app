import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const { email, client, image } = req.body;

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const base64Data = image.replace(/^data:image\/png;base64,/, "");

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "견적서",

      html: `
        <h2>견적서</h2>
        <p>수신처: ${client}</p>

        <p style="color:red;">
          ※ 이미지가 안 보이면 첨부파일을 확인하세요.
        </p>

        <img src="cid:previewimg" style="width:100%; max-width:600px;"/>
      `,

      attachments: [
        // 👉 본문 표시용 (cid)
        {
          filename: "preview.png",
          content: base64Data,
          encoding: "base64",
          cid: "previewimg"
        },

        // 👉 진짜 첨부파일
        {
          filename: "견적서.png",
          content: base64Data,
          encoding: "base64"
        }
      ]
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
}
