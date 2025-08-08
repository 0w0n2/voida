package com.bbusyeo.voida.api.chat.service;

import com.bbusyeo.voida.api.chat.domain.MeetingChat;
import com.bbusyeo.voida.api.chat.dto.ChatMessageRequestDto;
import com.bbusyeo.voida.api.chat.dto.ChatMessageResponseDto;
import com.bbusyeo.voida.api.chat.repository.MeetingChatRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;


@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final MeetingChatRepository meetingChatRepository;

    // WebSocket을 통해 메시지를 전송하기 위한 템플릿
    private final SimpMessagingTemplate messagingTemplate;

    // 특정 대기실의 과거 채팅 내역 조회
    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDto> getChatHistory(Long meetingRoomId, String memberUuid, Pageable pageable) {
        int pageSize = Math.min(pageable.getPageSize(), 50);
        PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageSize, pageable.getSort());

        Page<MeetingChat> chatHistory = meetingChatRepository.findByMeetingRoomIdOrderBySendedAtDesc(meetingRoomId, pageRequest);

        // 조회된 MeetingChat 페이지를 ChatMessageResponseDto 페이지로 변환 (여기서 isMine 계산)
        return chatHistory.map(chat -> ChatMessageResponseDto.from(chat, memberUuid));
    }

    // 실시간 채팅 메시지 처리, MongoDB에 저장 및 구독 중인 member들에게 브로드캐스팅
    @Override
    public void saveAndSend(Long meetingRoomId, ChatMessageRequestDto requestDto, Member sender) {

        MeetingChat chat = MeetingChat.builder()
                .meetingRoomId(meetingRoomId)
                .senderUuid(sender.getMemberUuid())
                .senderNickname(sender.getNickname())
                .profileImageUrl(sender.getProfileImageUrl())
                .content(requestDto.getContent())
                .sendedAt(LocalDateTime.now())
                .build();

        MeetingChat savedChat = meetingChatRepository.save(chat);
        System.out.println(sender.getNickname());
        // (/sub/chat/meetingRoom/{meetingRoomId}로 브로드 캐스팅
        messagingTemplate.convertAndSend("/sub/chat/meetingRoom/" + meetingRoomId, ChatMessageResponseDto.from(savedChat));
    }
}
