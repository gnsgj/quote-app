import nodemailer from 'nodemailer';

export default async function handler(req, res) {

  try {

    const {
      email,
      client,
      fixedManager,
      managerEmail,
      image
    } = req.body;

    /* =========================
       메일 설정
    ========================= */

    let transporter =
    nodemailer.createTransport({

      host: "smtp.gmail.com",

      port: 465,

      secure: true,

      auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

      }

    });

    /* =========================
       이미지 처리
    ========================= */

    const base64Data =
    image.replace(
      /^data:image\/png;base64,/,
      ""
    );

    const today =
    new Date().toISOString().slice(0,10);

    const fileName =
    `골프존견적서_${client}(${today}).png`;

    /* =========================
       참조메일 중복 제거
    ========================= */

    let ccArray = [];

    if(fixedManager){

      ccArray.push('kimms@gnsvce.com');

    }

    if(managerEmail){

      ccArray.push(managerEmail);

    }

    ccArray =
    ccArray.filter(v => v !== email);

    const uniqueCc =
    [...new Set(ccArray)].join(',');

    /* =========================
       메일 발송
    ========================= */

    await transporter.sendMail({

      from: process.env.EMAIL_USER,

      to: email,

      cc: uniqueCc,

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
          line-height:1.5;
          white-space:pre-line;
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

        {
          filename: "preview.png",

          content: base64Data,

          encoding: "base64",

          cid: "previewimg"
        },

        {
          filename: fileName,

          content: base64Data,

          encoding: "base64"
        }

      ]

    });

    /* =========================
       구글시트 발송이력 저장
    ========================= */

    const response =
    await fetch(

      'https://script.google.com/macros/s/AKfycbx3xkm-cxudWnpBVq7e2LKrJkNdWXJS--3MCI-AqYs0fVQfdS0ZrbkLI9Ef1mU29lYv/exec',

      {

        method:'POST',

        headers:{
          'Content-Type':
          'application/x-www-form-urlencoded'
        },

        body:

          `client=${encodeURIComponent(client)}` +

          `&email=${encodeURIComponent(email)}` +

          `&manager=${encodeURIComponent(managerEmail || "김만식")}` +

          `&total=${encodeURIComponent(req.body.total || "")}` +

          `&summary=${encodeURIComponent(req.body.summary || "")}` +

          `&note=${encodeURIComponent(req.body.note || "")}`

      }

    );

    const text =
    await response.text();

    if(!text.includes('success')){

      throw new Error(
        '구글시트 저장 실패'
      );

    }

    /* ========================= */

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
