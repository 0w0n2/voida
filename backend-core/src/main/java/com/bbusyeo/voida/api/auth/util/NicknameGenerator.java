package com.bbusyeo.voida.api.auth.util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class NicknameGenerator {

    private static final String[] adjectives = {
            "귀여운", "발랄한", "사랑스러운", "똑똑한", "활발한", "졸린", "장난꾸러기", "용감한", "상냥한", "행복한",
            "느긋한", "온화한", "믿음직한", "애교쟁이", "엉뚱한", "당당한", "재빠른", "조용한", "부드러운", "당돌한",
            "하품하는", "울상인", "비실비실한", "못말리는"
    };

    private static final String[] nouns = {
            "강아지", "고양이", "햄스터", "토끼", "앵무새", "거북이", "고슴도치", "말티즈", "푸들", "치와와",
            "오징어", "꼬마", "스피츠", "쇠똥구리", "해파리", "닭강정", "참치", "다람쥐", "이구아나", "비글", "도롱뇽", "머핀",
            "컵케잌", "바람"
    };

    private final Random random = new Random();

    public String generateNickname() {
        for (int i = 0; i < 20; i++) { // 20회까지 시도
            String adjective = adjectives[random.nextInt(adjectives.length)];
            String noun = nouns[random.nextInt(nouns.length)];
            int number = random.nextInt(1000); // 0~999

            String nickname = adjective + noun + number;
            if (nickname.length() <= 10) {
                return nickname;
            }
        }
        // fallback: 랜덤 숫자 기반 닉네임 (8자리 보장)
        return "유저" + String.format("%04d", random.nextInt(10000)); // 예: 유저0042
    }
}
