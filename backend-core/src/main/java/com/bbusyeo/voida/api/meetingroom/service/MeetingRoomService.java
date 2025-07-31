package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateRequestDto;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomCreateResponseDto;
import com.bbusyeo.voida.api.meetingroom.dto.MeetingRoomUpdateRequestDto;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingRoomService {

    private final S3Uploader s3Uploader;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MemberRepository memberRepository;
    private final ObjectMapper objectMapper;

    // 대기실 생성
    public MeetingRoom create(Long memberId, MeetingRoomCreateRequestDto request, MultipartFile thumbnailImage) {

        // 추후 JWT에서 member 정보 받아와서 연관관계 설정 필요
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));

        String thumbnailFileKey = null;
        final String s3DirName = "meeting-rooms/thumbnails";

        try {
            // 썸네일 이미지 처리
            if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
                // 사용자가 이미지를 업로드한 경우 S3에 업로드
                thumbnailFileKey = s3Uploader.upload(thumbnailImage, s3DirName);
            } else {
                // 이미지가 없는 경우, 카테고리별 기본 이미지 키 설정
                thumbnailFileKey = getDefaultThumbnailKey(request.getCategory());
            }

            // 요청 DTO를 MeetingRoom 엔티티로 변환
            MeetingRoom meetingRoom = MeetingRoom.builder()
                    .title(request.getTitle())
                    .categoryName(request.getCategory())
                    .thumbnailImageUrl(thumbnailFileKey)
                    .memberCount(1)
                    .build();

            // MeetingRoom 저장
            MeetingRoom saveMeetingRoom = meetingRoomRepository.save(meetingRoom);

            // 생성자 = Host 설정하는 MemberMeetingRoom 객체 생성
            MemberMeetingRoom hostLink = MemberMeetingRoom.builder()
                    .member(member)
                    .meetingRoom(saveMeetingRoom)
                    .state(MemberMeetingRoomState.HOST)
                    .build();

            // MemberMeetingRoom에 관계 저장
            memberMeetingRoomRepository.save(hostLink);
            return saveMeetingRoom;
        } catch (Exception e) {
            // 보상 트랜잭션: DB 저장 중 에러 발생 시, S3에 업로드된 파일이 있다면 삭제
            if (thumbnailFileKey != null && thumbnailImage != null && !thumbnailImage.isEmpty()) {
                s3Uploader.delete(thumbnailFileKey);
            }
            // 원래 예외를 그대로 던지거나, BaseException으로 감싸서 던짐
            if (e instanceof BaseException) throw e;
            throw new BaseException(BaseResponseStatus.DATABASE_CONSTRAINT_VIOLATION);
        }
    }

    @Transactional(readOnly = true)
    // 대기실 기본정보 조회
    public MeetingRoom findById(Long meetingRoomId) {
        return meetingRoomRepository.findById(meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.NOT_FOUND_MEETING_ROOM));
    }


    // 방 기본 정보 수정
    public MeetingRoom update(Long memberId, Long meetingRoomId, MeetingRoomUpdateRequestDto requestDto, MultipartFile newThumbnailImage) {
        // 방장 권한 확인하기
        checkHostAuthority(memberId, meetingRoomId);

        MeetingRoom meetingRoom = findById(meetingRoomId);
        String oldFileKey = meetingRoom.getThumbnailImageUrl();
        String newFileKey = oldFileKey; // 기존 이미지 키 유지 시켜두기

        final String s3DirName = "meeting-rooms/thumbnails";


        // 새 썸네일 이미지가 있는지 확인
        if (newThumbnailImage != null && !newThumbnailImage.isEmpty()) {
            // 새 이미지가 있다면 S3에 업로드하고 새로운 파일 키를 받음
            newFileKey = s3Uploader.upload(newThumbnailImage, s3DirName);
        }

        meetingRoom.update(requestDto.getTitle(), requestDto.getCategory(), newFileKey);

        // 후속 처리 : DB 업데이트 성공 후, 기존 사용자 업로드 이미지가 있다면 삭제해주기
        if (newThumbnailImage != null && !newThumbnailImage.isEmpty() && oldFileKey != null && !isDefaultImageKey(oldFileKey)) {
            s3Uploader.delete(oldFileKey);
        }

        return meetingRoom;
    }

    // 대기실 삭제
    public void delete(Long memberId, Long meetingRoomId) {
        // 방장 권한 확인
        checkHostAuthority(memberId, meetingRoomId);

        // MeetingRoom 존재 확인
        MeetingRoom meetingRoom = findById(meetingRoomId);
        String fileKeyToDelete = meetingRoom.getThumbnailImageUrl();

        // 연관된 MemberMeetingRoom 데이터 삭제
        memberMeetingRoomRepository.deleteByMeetingRoom_Id(meetingRoom.getId());

        // 모든 자식 데이터 삭제된 후, MeetingRoom 삭제
        meetingRoomRepository.delete(meetingRoom);

        // 후속 처리: DB 삭제 성공 후, 썸네일이 기본 이미지가 아니라면 S3에서도 삭제
        if (fileKeyToDelete != null && !isDefaultImageKey(fileKeyToDelete)) {
            s3Uploader.delete(fileKeyToDelete);
        }
    }


    // 방장 권한 확인 메서드
    public void checkHostAuthority(Long memberId, Long meetingRoomId) {
        // todo: memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Member member = memberRepository.findById(memberId)
                // 시스템에 존재하는 유저가 아닐때, 임시로 400 에러 => 추후 NOT_FOUND_MEMBER response로 바꿔야함
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));
        memberMeetingRoomRepository.findByMemberAndMeetingRoomId(member, meetingRoomId)
                .filter(memberMeetingRoom -> memberMeetingRoom.getState() == MemberMeetingRoomState.HOST)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.FORBIDDEN_ACCESS));
    }

    // 카테고리 이름에 따라 기본 이미지 키를 반환하는 헬퍼 메서드
    private String getDefaultThumbnailKey(String categoryName) {
        String basePath = "meeting-rooms/thumbnails/";
        return switch (categoryName.toLowerCase()) {
            case "game" -> basePath + "default_game_category.png";
            case "meeting" -> basePath + "default_meeting_category.png";
            case "talk" -> basePath + "default_talk_category.png";
            case "study" -> basePath + "default_study_category.png";
            default -> basePath + "default_free_category.png";
        };
    }

    // 기본 이미지인지 확인하는 메서드
    private boolean isDefaultImageKey(String key) {
        if (key == null) return true;
        return key.startsWith("meeting-rooms/thumbnails/default-");
    }
}