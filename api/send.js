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

    const base64Data =
    image.replace(/^data:image\/png;base64,/, "");

    // 현재날짜 생성
    const now = new Date();

    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2,'0');
    const dd = String(now.getDate()).padStart(2,'0');

    const today =
    `${yyyy}.${mm}.${dd}`;

    // 첨부파일명 자동생성
    const fileName =
    `골프존견적서_${client}(${today}).png`;

    await transporter.sendMail({

      from:
      `"지앤서비스 광주전라센터" <${process.env.EMAIL_USER}>`,

      to: email,

      subject: "골프존 견적서",

      html: `

        <div style="
          font-family:Malgun Gothic;
          font-size:15px;
          line-height:1.9;
          color:#222;
        ">

          안녕하세요<br><br>

          광주센터 김만식 입니다.<br><br>

          요청하신 견적서 발송해 드립니다.<br>

          <div style="
            color:red;
            font-weight:bold;
            margin-top:10px;
            margin-bottom:18px;
          ">

            ※ 이미지가 안 보이면 첨부파일을 확인해 주세요.

          </div>

          <img
            src="cid:previewimg"
            style="
              width:100%;
              max-width:700px;
              border:1px solid #ddd;
            "
          />

          <br><br><br>

          기타 문의사항 발생 시 언제든 말씀해주세요.<br><br>

          감사합니다.

        <br><br><br>

    <div style="
      color:#666;
      font-size:13px;
      line-height:1.8;
    ">

      김만식
      센터장
      CS3팀 광주센터 | 지앤서비스
      ---------------------------------
      T: 042-932-2206
      M: 010-2382-0313
      E: kimms@gnsvce.com
      W: www.gnsvce.com
      광주광역시 광산구 산월동 854-6번지

    </div>

  </div>

`,

      attachments: [

        // 본문 표시용
        {
          filename: fileName,
          content: base64Data,
          encoding: "base64",
          cid: "previewimg"
        },

        // 실제 첨부파일
        {
          filename: fileName,
          content: base64Data,
          encoding: "base64"
        }

      ]

    });

    res.status(200).json({
      success: true
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      success: false
    });

  }

}
