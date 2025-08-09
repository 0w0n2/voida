package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MemberSocialRepository extends JpaRepository<MemberSocial, Long> {

    @EntityGraph(attributePaths = "member")
    Optional<MemberSocial> findByEmail(String providerEmail);

    void deleteMemberSocialsByMemberId(Long memberId);
}
