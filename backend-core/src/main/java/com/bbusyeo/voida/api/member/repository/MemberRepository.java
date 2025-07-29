package com.bbusyeo.voida.api.member.repository;

import com.bbusyeo.voida.api.member.domain.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MemberRepository extends JpaRepository<Member, Long> {
} 