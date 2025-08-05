package com.bbusyeo.voida.api.meetingroom.domain;

import com.bbusyeo.voida.global.exception.BaseException;
import com.bbusyeo.voida.global.response.BaseResponseStatus;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Table(name = "meeting_room")
public class MeetingRoom {

    private static final int MAX_MEMBER_COUNT = 6;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="id")
    private Long id;

    @Column(name = "title", nullable = false, length = 50)
    private String title;

    @Column(name = "category_name", nullable = false, length = 10)
    private String categoryName;

    @Column(name = "thumbnail_image_url", nullable = false, length = 500)
    private String thumbnailImageUrl;

    @Column(name = "member_count", nullable = false)
    private int memberCount;

    public void update(String title, String categoryName, String thumbnailImageUrl) {
        if (title != null) {
            this.title = title;
        }
        if (categoryName != null) {
            this.categoryName = categoryName;
        }
        if (thumbnailImageUrl != null) {
            this.thumbnailImageUrl = thumbnailImageUrl;
        }
    }

    // 참여자 증가하는 메서드
    public void increaseMemberCount() {
        if (this.memberCount >= MAX_MEMBER_COUNT) {
            throw new BaseException(BaseResponseStatus.MEETING_ROOM_FULL);
        }
        this.memberCount++;
    }

    // 참여자 감소하는 메서드
    public void decreaseMemberCount() {
        if (this.memberCount > 0) {
            this.memberCount--;
        }
    }

    @Builder
    public MeetingRoom(String title, String categoryName, String thumbnailImageUrl, Integer memberCount) {
        this.title = title;
        this.categoryName = categoryName;
        this.thumbnailImageUrl = thumbnailImageUrl;
        this.memberCount = memberCount;
    }
}
