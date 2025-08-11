package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.MemberSetting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberSettingRepository extends JpaRepository<MemberSetting, Long> {
    MemberSetting findMemberSettingsByMemberId(Long memberId);
    List<MemberSetting> findByMember_MemberUuidIn(List<String> memberUuids);
    void deleteMemberSettingByMemberId(Long memberId);
}
