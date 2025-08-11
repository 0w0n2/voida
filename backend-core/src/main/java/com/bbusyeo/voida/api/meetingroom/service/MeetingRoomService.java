package com.bbusyeo.voida.api.meetingroom.service;

import com.bbusyeo.voida.api.meetingroom.domain.MeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.MemberMeetingRoom;
import com.bbusyeo.voida.api.meetingroom.domain.enums.MemberMeetingRoomState;
import com.bbusyeo.voida.api.meetingroom.dto.*;
import com.bbusyeo.voida.api.meetingroom.repository.MeetingRoomRepository;
import com.bbusyeo.voida.api.meetingroom.repository.MemberMeetingRoomRepository;
import com.bbusyeo.voida.api.member.domain.Member;
import com.bbusyeo.voida.api.member.domain.MemberSetting;
import com.bbusyeo.voida.api.member.repository.MemberRepository;
import com.bbusyeo.voida.api.member.repository.MemberSettingRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import com.bbusyeo.voida.global.support.S3Uploader;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

import java.util.List;
import java.util.stream.Collectors;

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
    private final MemberSettingRepository memberSettingRepository;


    // 대기실 생성
    public MeetingRoom create(String memberUuid, MeetingRoomCreateRequestDto request, MultipartFile thumbnailImage) {

        Member member = memberRepository.findByMemberUuid(memberUuid)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

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
                    .memberUuid(memberUuid)
                    .meetingRoom(saveMeetingRoom)
                    .state(MemberMeetingRoomState.HOST)
                    .build();

            // MemberMeetingRoom에 관계 저장
            memberMeetingRoomRepository.save(hostLink);
            return saveMeetingRoom;
        } catch (Exception e) {
            // 보상 트랜잭션: DB 저장 중 에러 발생 시, S3에 업로드된 파일이 있다면 삭제 (기본 이미지 제외)
            if (thumbnailImage != null && isDefaultImageKey(thumbnailFileKey)) {
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

    // 내가 참여중인 대기실 조회
    @Transactional(readOnly = true)
    public List<MyMeetingRoomResponseDto> findMyMeetingRooms(String memberUuid) {
        List<MemberMeetingRoom> memberMeetingRooms = memberMeetingRoomRepository.findByMemberUuid(memberUuid);

        if (memberMeetingRooms.isEmpty()) {
            throw new BaseException(BaseResponseStatus.NO_MEETING_ROOMS_JOINED);
        }

        return memberMeetingRooms.stream()
                .map(MemberMeetingRoom::getMeetingRoom)
                .map(MyMeetingRoomResponseDto::from)
                .collect(Collectors.toList());
    }

    // 방 기본 정보 수정
    public MeetingRoom update(String memberUuid, Long meetingRoomId, MeetingRoomUpdateRequestDto requestDto, MultipartFile newThumbnailImage) {
        // 방장 권한 확인하기
        checkHostAuthority(memberUuid, meetingRoomId);

        MeetingRoom meetingRoom = findById(meetingRoomId);
        String oldFileKey = meetingRoom.getThumbnailImageUrl();
        String newFileKey = oldFileKey; // 기본적으로 이전 파일 유지

        boolean isNewImageUploaded = newThumbnailImage != null && !newThumbnailImage.isEmpty();
        boolean isCategoryChanged = !Objects.equals(meetingRoom.getCategoryName(), requestDto.getCategory());

        // 사용자가 새롭게 썸네일 이미지를 수정하였을 때
        if (isNewImageUploaded) {
            newFileKey = s3Uploader.upload(newThumbnailImage, S3_THUMBNAIL_DIR);
        }
        // 사진 변경은 없고, 기존에 default 이미지였고, 카테고리만 바뀌면 그 카테고리에 맞는 default 이미지로 변경
        else if (isCategoryChanged) {
            if (isDefaultImageKey(oldFileKey)) {
            newFileKey = getDefaultThumbnailKey(requestDto.getCategory());
            }
        }

        try {
            // DB 엔티티 업데이트
            meetingRoom.update(requestDto.getTitle(), requestDto.getCategory(), newFileKey);

            // 후속 처리 : DB 업데이트 성공 후, 기존 사용자 업로드 이미지가 있다면 S3에서 삭제
            if (isNewImageUploaded && oldFileKey != null && !isDefaultImageKey(oldFileKey)) {
                s3Uploader.delete(oldFileKey);
            }
            return meetingRoom;

        } catch (Exception e) {
            // 보상 트랜잭션: DB 업데이트 중 에러 발생 시, S3에 새로 업로드된 파일이 있다면 삭제
            if (isNewImageUploaded && newFileKey != null && !isDefaultImageKey(newFileKey)) {
                s3Uploader.delete(newFileKey);
            }
            // 원래 예외를 그대로 던지거나, BaseException으로 감싸서 던지기
            if (e instanceof BaseException) throw e;
            throw new BaseException(BaseResponseStatus.DATABASE_CONSTRAINT_VIOLATION);
        }
    }

    // 대기실 삭제
    public void delete(String memberUuid, Long meetingRoomId) {
        // 방장 권한 확인
        checkHostAuthority(memberUuid, meetingRoomId);

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

    // 대기실 참여자 정보 리스트 조회
    @Transactional(readOnly = true)
    public MeetingRoomParticipantListDto getMeetingRoomMembers(String currentMemberUuid, Long meetingRoomId) {

        // meetingRoomId로 모든 참여자 상태 조회
        List<MemberMeetingRoom> allMemberMeetingRooms = memberMeetingRoomRepository.findByMeetingRoomId(meetingRoomId);

        if (allMemberMeetingRooms.isEmpty()) {
            return MeetingRoomParticipantListDto.of(Collections.emptyList());
        }

        // 참여 관계에서 memberUuid 목록 추출
        List<String> memberUuids = allMemberMeetingRooms.stream()
                .map(MemberMeetingRoom::getMemberUuid)
                .collect(Collectors.toList());

        // 추출된 memberUuid 목록으로 Member 정보들을 조회
        Map<String, Member> memberByUuidMap = memberRepository.findByMemberUuidIn(memberUuids).stream()
                .collect(Collectors.toMap(Member::getMemberUuid, member -> member));

        // 추출된 memberUuid 목록으로 memberSetting 정보 조회
        Map<String, MemberSetting> memberSettingByUuidMap = memberSettingRepository.findByMember_MemberUuidIn(memberUuids).stream()
                .collect(Collectors.toMap(memberSetting -> memberSetting.getMember().getMemberUuid(), memberSetting -> memberSetting));

        // 참여 정보를 DTO로 변환
        List<ParticipantInfoDto> participants = allMemberMeetingRooms.stream()
                .map(memberMeetingRoom -> {
                    Member member = memberByUuidMap.get(memberMeetingRoom.getMemberUuid());
                    MemberSetting memberSetting = memberSettingByUuidMap.get(member.getMemberUuid());
                    return ParticipantInfoDto.of(memberMeetingRoom, member, memberSetting, currentMemberUuid);
                })
                .collect(Collectors.toList());

        return MeetingRoomParticipantListDto.of(participants);
    }

    // 방장 위임
    public void changeHost(String memberUuid, Long meetingRoomId, String newHostMemberUuid) {

        // 요청자가 방장인지 확인
        checkHostAuthority(memberUuid, meetingRoomId);

        // 자기 자신에게 위임하는지 확인
        if (memberUuid.equals(newHostMemberUuid)) {
            throw new BaseException(BaseResponseStatus.CANNOT_CHANGE_TO_SELF);
        }

        // 현재 방장 정보 조회 (일반 참여자로 변경해주기 위해 필요)
        MemberMeetingRoom currentHostMemberMeetingRoom = memberMeetingRoomRepository.findByMemberUuidAndMeetingRoomId(memberUuid, meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND));

        // 위임 받을 멤버가 방에 참여중인지 검사
        MemberMeetingRoom newHostMemberMeetingRoom = memberMeetingRoomRepository.findByMemberUuidAndMeetingRoomId(newHostMemberUuid, meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND));

        // 권한 변경
        currentHostMemberMeetingRoom.updateState(MemberMeetingRoomState.PARTICIPANT);
        newHostMemberMeetingRoom.updateState(MemberMeetingRoomState.HOST);
    }

    // 유저 추방
    public void kickMember(String memberUuid, Long meetingRoomId, String kickMemberUuid) {

        // 요청자 방장인지 확인
        checkHostAuthority(memberUuid, meetingRoomId);

        // 방장 자기 자신 추방하려는지 확인
        if (memberUuid.equals(kickMemberUuid)) {
            throw new BaseException(BaseResponseStatus.CANNOT_CHANGE_TO_SELF);
        }

        // 추방할 member가 방에 참여중인지 확인
        MemberMeetingRoom memberMeetingRoom = memberMeetingRoomRepository
                .findByMemberUuidAndMeetingRoomId(kickMemberUuid, meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND));

        // 참여자 <-> 대기실 관계 제거, 대기실 인원 1 감소
        MeetingRoom meetingRoom = memberMeetingRoom.getMeetingRoom();
        meetingRoom.decreaseMemberCount();
        memberMeetingRoomRepository.delete(memberMeetingRoom);
    }

    // 대기실 나가기(탈퇴)
    public void leaveMeetingRoom(String memberUuid, Long meetingRoomId) {

        // 방에 참여중인지 확인
        MemberMeetingRoom memberMeetingRoom = memberMeetingRoomRepository
                .findByMemberUuidAndMeetingRoomId(memberUuid, meetingRoomId)
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEETING_ROOM_MEMBER_NOT_FOUND));

        // 요청한 유저가 방장인지 확인
        if (memberMeetingRoom.getState() == MemberMeetingRoomState.HOST) {
            throw new BaseException(BaseResponseStatus.HOST_CANNOT_LEAVE);
        }

        // member <-> meetingRoom 관계 제거, 대기실 인원 1 감소
        MeetingRoom meetingRoom = memberMeetingRoom.getMeetingRoom();
        meetingRoom.decreaseMemberCount();
        memberMeetingRoomRepository.delete(memberMeetingRoom);
    }

    // 방장 권한 확인 메서드
    public void checkHostAuthority(String memberUuid, Long meetingRoomId) {
        memberRepository.findByMemberUuid(memberUuid)
                // 시스템에 존재하는 유저가 아닐때
                .orElseThrow(() -> new BaseException(BaseResponseStatus.MEMBER_NOT_FOUND));

        memberMeetingRoomRepository.findByMemberUuidAndMeetingRoomId(memberUuid, meetingRoomId)
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