import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const { email, client, item, price, qty } = req.body;

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: '너의이메일@gmail.com',
        pass: '앱비밀번호'
      }
    });

    let html = `
      <h2>견적서</h2>
      <p>수신처: ${client}</p>
      <p>${item} / ${qty}개 / ${price}원</p>
    `;

    await transporter.sendMail({
      from: '너의이메일@gmail.com',
      to: email,
      subject: '견적서',
      html: html
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
}
