package com.bbusyeo.voida.api.admin.controller;

import com.bbusyeo.voida.api.admin.dto.GetLiveRoomWhitelistsResponseDto;
import com.bbusyeo.voida.api.admin.service.AdminLiveRoomService;
import com.bbusyeo.voida.global.response.BaseResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RequestMapping("/v1/admin/live-rooms/")
@Tag(name = "Admin - Live Room", description = "라이브 관련 관리자 API")
@RequiredArgsConstructor
@RestController
public class AdminLiveRoomController {

    private final AdminLiveRoomService adminLiveRoomService;

    @Operation(summary = "특정 라이브방 화이트 리스트 추가 API")
    @PostMapping("/whitelists/{meetingRoomId}")
    public BaseResponse<Void> addLiveRoomWhitelists(@PathVariable Long meetingRoomId) {
        adminLiveRoomService.addLiveRoomWhitelist(meetingRoomId);
        return new BaseResponse<>();
    }
    
    @Operation(summary = "특정 라이브방 화이트 리스트 제거 API")
    @DeleteMapping("/whitelists/{meetingRoomId}")
    public BaseResponse<String> deleteLiveRoomWhitelists(@PathVariable Long meetingRoomId) {
        adminLiveRoomService.removeLiveRoomWhitelist(meetingRoomId);
        return new BaseResponse<>();
    }

    @Operation(summary = "전체 락 해제에 사용하기 위한 모든 라이브방 화이트 리스트 제거 API")
    @DeleteMapping("/whitelists")
    public BaseResponse<String> deleteAllLiveRoomWhitelists() {
        adminLiveRoomService.clearAllWhiteLists();
        return new BaseResponse<>();
    }

    @Operation(summary = "라이브방 화이트 리스트 내역 조회 API")
    @GetMapping("/whitelists")
    public BaseResponse<GetLiveRoomWhitelistsResponseDto> getLiveRoomWhitelists() {
        return new BaseResponse<>(GetLiveRoomWhitelistsResponseDto.toDto(adminLiveRoomService.getAllLiveRoomWhitelist()));
    }

}
