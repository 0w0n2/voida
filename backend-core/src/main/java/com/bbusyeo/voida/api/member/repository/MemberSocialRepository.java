package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.MemberSocial;
import com.bbusyeo.voida.api.member.domain.enums.ProviderName;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberSocialRepository extends JpaRepository<MemberSocial, Long> {

    void deleteMemberSocialsByMemberId(Long memberId);

    List<MemberSocial> findMemberSocialsByMemberId(Long memberId);

    @EntityGraph(attributePaths = "member")
    Optional<MemberSocial> findByProviderNameAndProviderId(ProviderName providerName, String providerId);
}
