package com.bbusyeo.voida.api.release.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.INVALID_VERSION;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.RELEASE_NOT_FOUND;

import com.bbusyeo.voida.api.release.domain.DesktopApp;
import com.bbusyeo.voida.api.release.dto.in.DesktopAppRequestDto;
import com.bbusyeo.voida.api.release.dto.out.DesktopAppResponseDto;
import com.bbusyeo.voida.api.release.repository.ReleaseRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReleaseServiceImpl implements ReleaseService {

    private final ReleaseRepository releaseRepository;

    @Override
    public DesktopAppResponseDto getLatestRelease() {

        return DesktopAppResponseDto.from(
            releaseRepository.findTopByOrderByUploadedAtDesc()
                .orElseThrow(() -> new BaseException(RELEASE_NOT_FOUND)));
    }

    @Override
    public DesktopAppResponseDto getReleaseByVersion(String version) {

        return DesktopAppResponseDto.from(
            releaseRepository.findTopByVersionOrderByUploadedAtDesc(version)
                .orElseThrow(() -> new BaseException(INVALID_VERSION)));
    }

    @Transactional
    @Override
    public void createRelease(DesktopAppRequestDto dto) {

        releaseRepository.save(
            releaseRepository.findByVersion(dto.getVersion())
                .map(dto::toEntity)
                .orElse(dto.toEntity()));
    }

}
