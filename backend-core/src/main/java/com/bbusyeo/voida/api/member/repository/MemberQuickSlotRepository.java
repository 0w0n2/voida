package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.MemberQuickSlot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemberQuickSlotRepository extends JpaRepository<MemberQuickSlot, Long> {
    List<MemberQuickSlot> findMemberQuickSlotsByMemberId(Long memberId);
}
