package com.bbusyeo.voida.api.chat.controller;

import com.bbusyeo.voida.api.chat.dto.ChatMessageRequestDto;
import com.bbusyeo.voida.api.chat.dto.ChatMessageResponseDto;
import com.bbusyeo.voida.api.chat.service.ChatService;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.global.response.BaseResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    // Get, 대기실의 채팅 내역을 페이징하여 조회
    @GetMapping("/v1/meeting-rooms/{meetingRoomId}/chats")
    public BaseResponse<Page<ChatMessageResponseDto>> getChatHistory(
            @AuthenticationPrincipal(expression = "member") Member member,
            @PathVariable Long meetingRoomId,
            @PageableDefault(size = 20, sort = "sendedAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<ChatMessageResponseDto> chatHistory = chatService.getChatHistory(meetingRoomId, member.getMemberUuid(), pageable);
        return new BaseResponse<>(chatHistory);
    }

    // WebSocket, 발행한 채팅 메시지를 수신하여 저장 및 처리
    @MessageMapping("/chat/message/{meetingRoomId}")
    public void message(@DestinationVariable Long meetingRoomId,
                        ChatMessageRequestDto requestDto,
                        @AuthenticationPrincipal(expression = "member") Member member) {
        chatService.saveAndSend(meetingRoomId, requestDto, member);
    }
}
