package com.bbusyeo.voida.api.distribution.repository;

import com.bbusyeo.voida.api.distribution.domain.DesktopApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DistributionRepository extends JpaRepository<DesktopApp, Long> {

    Optional<DesktopApp> findTopByOrderByUploadedAtDesc();
    Optional<DesktopApp> findTopByVersionOrderByUploadedAtDesc(String version);

}
