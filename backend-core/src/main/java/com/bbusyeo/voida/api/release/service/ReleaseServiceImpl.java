package com.bbusyeo.voida.api.release.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.INVALID_VERSION;

import com.bbusyeo.voida.api.release.dto.out.DesktopAppResponseDto;
import com.bbusyeo.voida.api.release.repository.ReleaseRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReleaseServiceImpl implements ReleaseService {

    private final ReleaseRepository releaseRepository;

    @Transactional(readOnly = true)
    @Override
    public DesktopAppResponseDto getReleaseByVersion(String version) {
        return DesktopAppResponseDto.from(
            releaseRepository.findTopByVersionOrderByUploadedAtDesc(version)
                .orElseThrow(() -> new BaseException(INVALID_VERSION)));
    }

}
