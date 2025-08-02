package com.bbusyeo.voida.api.auth.repository;

import com.bbusyeo.voida.api.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AuthRepository extends JpaRepository<Member, Long> { // <엔티티 클래스, 기본키 타입>
    Optional<Member> findByEmail(String email);

    Optional<Member> findByMemberUuid(String memberUuid);

    boolean existsByNickname(String nickname);
}
