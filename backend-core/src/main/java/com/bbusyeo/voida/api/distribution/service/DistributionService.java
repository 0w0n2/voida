package com.bbusyeo.voida.api.distribution.service;

import com.bbusyeo.voida.api.distribution.dto.out.DistributionResponseDto;

public interface DistributionService {

    DistributionResponseDto getDistributionByVersion(String version);

}
