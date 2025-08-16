package com.bbusyeo.voida.api.chat.service;

import com.bbusyeo.voida.api.chat.domain.MeetingChat;
import com.bbusyeo.voida.api.chat.dto.ChatMessageRequestDto;
import com.bbusyeo.voida.api.chat.dto.ChatMessageResponseDto;
import com.bbusyeo.voida.api.chat.repository.MeetingChatRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional
public class ChatServiceImpl implements ChatService {

    private final MeetingChatRepository meetingChatRepository;

    // WebSocket을 통해 메시지를 전송하기 위한 템플릿
    private final SimpMessagingTemplate messagingTemplate;
    private final MemberRepository memberRepository;

    // 특정 대기실의 과거 채팅 내역 조회
    @Override
    @Transactional(readOnly = true)
    public Page<ChatMessageResponseDto> getChatHistory(Long meetingRoomId, String memberUuid, Pageable pageable) {
        int pageSize = Math.min(pageable.getPageSize(), 50);
        PageRequest pageRequest = PageRequest.of(pageable.getPageNumber(), pageSize, pageable.getSort());

        Page<MeetingChat> chatHistory = meetingChatRepository.findByMeetingRoomIdOrderBySendedAtDesc(meetingRoomId, pageRequest);

        // 중복 제거한 senderUuid 목록 추출
        List<String> senderUuids = chatHistory.getContent().stream()
                .map(MeetingChat::getSenderUuid)
                .distinct()
                .collect(Collectors.toList());

        // My SQL 에서 Member 정보 한번에 조회
        Map<String, Member> membersMap = memberRepository.findByMemberUuidIn(senderUuids).stream()
                .collect(Collectors.toMap(Member::getMemberUuid, member -> member));

        // Member 정보와 조합하여 DTO 생성
        return chatHistory.map(chat -> {
            Member sender = membersMap.get(chat.getSenderUuid());
            return ChatMessageResponseDto.from(chat, sender, memberUuid);
        });
    }

    // 실시간 채팅 메시지 처리, MongoDB에 저장 및 구독 중인 member들에게 브로드캐스팅
    @Override
    public void saveAndSend(Long meetingRoomId, ChatMessageRequestDto requestDto, Member member) {

        Member sender = memberRepository.findByMemberUuid(member.getMemberUuid())
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        MeetingChat chat = MeetingChat.builder()
                .meetingRoomId(meetingRoomId)
                .senderUuid(sender.getMemberUuid())
                .content(requestDto.getContent())
                .sendedAt(LocalDateTime.now())
                .build();

        MeetingChat savedChat = meetingChatRepository.save(chat);
        // (/sub/chat/meetingRoom/{meetingRoomId}로 브로드 캐스팅
        messagingTemplate.convertAndSend("/sub/chat/meetingRoom/" + meetingRoomId, ChatMessageResponseDto.from(savedChat, sender));
    }
}
