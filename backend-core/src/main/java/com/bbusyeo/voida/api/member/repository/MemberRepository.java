package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemberRepository extends JpaRepository<Member, Long> { // <엔티티 클래스, 기본키 타입>
    Optional<Member> findByEmail(String email);

    Optional<Member> findByMemberUuid(String memberUuid);

    List<Member> findByMemberUuidIn(List<String> memberUuids);

    boolean existsByNickname(String nickname);

    boolean existsByMemberUuid(String memberUuid);

    boolean existsByEmail(String email);

}
