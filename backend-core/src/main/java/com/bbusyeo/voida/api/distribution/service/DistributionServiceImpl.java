package com.bbusyeo.voida.api.distribution.service;

import static com.bbusyeo.voida.global.response.BaseResponseStatus.INVALID_VERSION;
import static com.bbusyeo.voida.global.response.BaseResponseStatus.RELEASE_NOT_FOUND;

import com.bbusyeo.voida.api.distribution.dto.out.DistributionResponseDto;
import com.bbusyeo.voida.api.distribution.repository.DistributionRepository;
import com.bbusyeo.voida.global.exception.BaseException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class DistributionServiceImpl implements DistributionService {

    private final DistributionRepository distributionRepository;

    @Transactional(readOnly = true)
    @Override
    public DistributionResponseDto getDistributionByVersion(String version) {
        return DistributionResponseDto.from(
                version.equals("latest")
                        ? distributionRepository.findTopByOrderByUploadedAtDesc()
                        .orElseThrow(() -> new BaseException(RELEASE_NOT_FOUND))
                        : distributionRepository.findTopByVersionOrderByUploadedAtDesc(version)
                        .orElseThrow(() -> new BaseException(INVALID_VERSION)));
    }

}
