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

import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional
public class MeetingRoomService {

    private static final String S3_THUMBNAIL_DIR = "meeting-rooms/thumbnails/";
    private static final Map<String, String> CATEGORY_TO_FILENAME_MAP;
    private static final Set<String> DEFAULT_FILENAMES;

    static {
        Map<String, String> categoryMap = new HashMap<>();
        categoryMap.put("game", "default_game_category.png");
        categoryMap.put("meeting", "default_meeting_category.png");
        categoryMap.put("talk", "default_talk_category.png");
        categoryMap.put("study", "default_study_category.png");
        categoryMap.put("free", "default_free_category.png");
        CATEGORY_TO_FILENAME_MAP = Collections.unmodifiableMap(categoryMap);

        DEFAULT_FILENAMES = Collections.unmodifiableSet(new HashSet<>(categoryMap.values()));
    }

    private final S3Uploader s3Uploader;
    private final MeetingRoomRepository meetingRoomRepository;
    private final MemberMeetingRoomRepository memberMeetingRoomRepository;
    private final MemberRepository memberRepository;


    // 대기실 생성
    public MeetingRoom create(Long memberId, MeetingRoomCreateRequestDto request, MultipartFile thumbnailImage) {

        // Todo: memberId는 혜원 작업 완료 후, 인증(JWT 토큰)에서 가져와야함
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT));

        String thumbnailFileKey = null;

        try {
            // 썸네일 이미지 처리
            if (thumbnailImage != null && !thumbnailImage.isEmpty()) {
                // 사용자가 이미지를 업로드한 경우 S3에 업로드
                thumbnailFileKey = s3Uploader.upload(thumbnailImage, S3_THUMBNAIL_DIR);
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
        String newFileKey = null; // 새 파일이 업로드 되었는지 확인하기 위해 null로 초기화


        // 새 썸네일 이미지가 있는지 확인
        if (newThumbnailImage != null && !newThumbnailImage.isEmpty()) {
            // 새 이미지가 있다면 S3에 업로드하고 새로운 파일 키를 받음
            newFileKey = s3Uploader.upload(newThumbnailImage, S3_THUMBNAIL_DIR);
        }

        try {
            // DB 엔티티 업데이트
            // 새 파일이 있으면 newFileKey를, 없으면 oldFileKey를 사용
            meetingRoom.update(requestDto.getTitle(), requestDto.getCategory(), (newFileKey != null) ? newFileKey : oldFileKey);

            // 후속 처리 : DB 업데이트 성공 후, 기존 사용자 업로드 이미지가 있다면 S3에서 삭제
            if (newFileKey != null && oldFileKey != null && !isDefaultImageKey(oldFileKey)) {
                s3Uploader.delete(oldFileKey);
            }

            return meetingRoom;
        } catch (Exception e) {
            // 보상 트랜잭션: DB 업데이트 중 에러 발생 시, S3에 새로 업로드된 파일이 있다면 삭제
            if (newFileKey != null) {
                s3Uploader.delete(newFileKey);
            }

            // 원래 예외를 그대로 던지거나, BaseException으로 감싸서 던지기
            if (e instanceof BaseException) throw e;
            throw new BaseException(BaseResponseStatus.DATABASE_CONSTRAINT_VIOLATION);
        }
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
        String fileName = CATEGORY_TO_FILENAME_MAP.get(categoryName.toLowerCase());

        // 카테고리 설정하지 않았을 때 프론트엔드에 보내줄 응답코드
        if (fileName == null) {
            throw new BaseException(BaseResponseStatus.ILLEGAL_ARGUMENT);
        }
        return S3_THUMBNAIL_DIR + fileName;
    }

    // 기본 이미지인지 확인하는 메서드
    private boolean isDefaultImageKey(String key) {
        if (key == null) return true;

        // S3 디렉토리 경로로 시작하는지 먼저 확인
        if (!key.startsWith(S3_THUMBNAIL_DIR)) {
            return false;
        }
        // 디렉토리 경로를 제외한 파일 이름만 추출
        String fileName = key.substring(S3_THUMBNAIL_DIR.length());

        // 추출한 파일 이름이 기본 이미지 파일명 Set에 포함되어 있는지 확인
        return DEFAULT_FILENAMES.contains(fileName);
    }
}