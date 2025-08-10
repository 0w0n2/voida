package com.bbusyeo.voida.api.release.service;

import com.bbusyeo.voida.api.release.dto.out.DesktopAppResponseDto;

public interface ReleaseService {

    DesktopAppResponseDto getReleaseByVersion(String version);

}
