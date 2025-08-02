package com.bbusyeo.voida.global.mail.util;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.util.Map;
import java.util.function.Function;

@Getter
@RequiredArgsConstructor
public enum MailType {
    SIGN_UP_EMAIL_VERIFICATION(
            "[보이다] 이메일 인증을 완료해주세요 ✨",
            values -> """
                    <html><body><div><table border="0" cellpadding="0"
                     cellspacing="0" style="width: 815px; margin: 55px
                     auto; border: 0; background-color: #fff;
                     line-height: 1.5; text-align: left; font-family:
                     Roboto, Noto Sans KR, 나눔고딕, NanumGothic,
                     맑은고딕, Malgun Gothic, 돋움, Dotum, Arial,
                     Tahoma, Geneva, Verdana;"><tbody><tr><td></td></
                     tr><tr><td style="padding: 35px; border-top: 1px
                     solid #000; border-bottom: 1px solid #cfd5d8;
                     color: #666; font-size: 15px; text-align: left;
                     line-height: 1.86;"><h1 style="color: #000000">
                     보이다 이메일 인증 안내</h1>안녕하세요, 회원님.<br
                     /><strong>회원가입</strong>을 위해 이메일 인증을
                     진행합니다.<br />아래 발급된 이메일 인증번호를
                     복사하거나 직접 입력하여 인증을 완료해주세요.<br
                     /><br /><div style="background-color: #f1f3f5;
                     padding: 20px; border-radius: 8px; margin-bottom:
                     30px; text-align: left;"><span style="color:
                     #000000c3; font-size: 20px; font-weight: 500;
                     padding-right: 40px;">인증번호 </span><span style
                     ="color: #378aff; font-size: 20px; font-weight:
                     1000">%s</span></div>회원 본인이
                     아니라면 이 메시지를 무시해주시길 바랍니다.<br
                     />감사합니다.<br /><br /></td></tr><tr><td align=
                     "center" valign="top"><div style="max-width:
                     480px; padding: 40px 16px 0"><h6 align="center"
                     style="word-break: keep-all; font-weight: 500;
                     font-size: 12px; line-height: 20px; color:
                     #b2c0cc; margin: 0;">Copyright ⓒ Voida. All
                     Rights Reserved</h6></div></td></tr><tr><td
                     height="80"></td></tr></tbody></table></div></body></html>
                    """.formatted(values.get("code"))
    ),

    PASSWORD_RESET(
            "비밀번호 재설정",
            values -> """
                    <html><body>
                        <p>%s님, 임시 비밀번호는 <b>%s</b>입니다.</p>
                    </body></html>
                    """.formatted(values.get("username"), values.get("tempPassword"))
    );

    private final String subject;
    private final Function<Map<String, Object>, String> contentBuilder;

    public String buildContent(Map<String, Object> values) {
        return contentBuilder.apply(values);
    }
}