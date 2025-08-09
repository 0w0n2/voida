package com.bbusyeo.voida.api.member.dto;

import jakarta.validation.Valid;
import lombok.Getter;
import lombok.ToString;

import java.util.List;

@Getter
@ToString
public class ChangeQuickSlotsRequestDto {

    @Valid
    List<MeQuickSlotsRequestInfoDto> quickSlots;

}
