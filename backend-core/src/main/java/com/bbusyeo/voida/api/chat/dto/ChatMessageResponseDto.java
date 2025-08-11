package com.bbusyeo.voida.api.chat.dto;

import com.bbusyeo.voida.api.chat.domain.MeetingChat;
import lombok.Builder;
import lombok.Getter;

import java.time.format.DateTimeFormatter;

@Getter
@Builder
public class ChatMessageResponseDto {
    private String senderUuid;
    private String senderNickname;
    private String profileImageUrl;
    private String content;
    private String sendedAt; // ISO 8601 형식 String
    private Boolean isMine;

    // 과거 채팅 내용 조회용 (isMine 처리 위해 memberUuid 바탕으로 생성, 프론트엔드에서 확인할 필요 없음)
    public static ChatMessageResponseDto from(MeetingChat chat, String currentMemberUuid) {
        return ChatMessageResponseDto.builder()
                .senderUuid(chat.getSenderUuid())
                .senderNickname(chat.getSenderNickname())
                .profileImageUrl(chat.getProfileImageUrl())
                .content(chat.getContent())
                .sendedAt(chat.getSendedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .isMine(chat.getSenderUuid().equals(currentMemberUuid))
                .build();
    }

    // 실시간 브로드 캐스팅용 (isMine 처리 x)
    public static ChatMessageResponseDto from(MeetingChat chat) {
        return ChatMessageResponseDto.builder()
                .senderUuid(chat.getSenderUuid())
                .senderNickname(chat.getSenderNickname())
                .profileImageUrl(chat.getProfileImageUrl())
                .content(chat.getContent())
                .sendedAt(chat.getSendedAt().format(DateTimeFormatter.ISO_DATE_TIME))
                .isMine(null) // 프론트엔드가 senderUuid와 member uuid 비교하여 isMine 판단
                .build();
    }
}
