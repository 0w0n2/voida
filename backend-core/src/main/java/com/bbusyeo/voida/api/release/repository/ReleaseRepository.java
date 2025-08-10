package com.bbusyeo.voida.api.release.repository;

import com.bbusyeo.voida.api.release.domain.DesktopApp;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReleaseRepository extends JpaRepository<DesktopApp, Long> {

    Optional<DesktopApp> findTopByOrderByUploadedAtDesc();
    Optional<DesktopApp> findTopByVersionOrderByUploadedAtDesc(String version);

}
