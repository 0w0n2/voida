package com.bbusyeo.voida.api.chat.service;

import com.bbusyeo.voida.api.chat.dto.ChatMessageRequestDto;
import com.bbusyeo.voida.api.chat.dto.ChatMessageResponseDto;
import com.bbusyeo.voida.api.member.domain.Member;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChatService {
    Page<ChatMessageResponseDto> getChatHistory(Long meetingRoomId, String memberUuid, Pageable pageable);
    void saveAndSend(Long meetingRoomId, ChatMessageRequestDto requestDto, Member sender);
}
