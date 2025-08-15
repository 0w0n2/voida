package com.bbusyeo.voida.api.member.service;

public interface DeleteAccountService {

    void deleteAccount(Long memberId);

    void checkMemberIsHost(String memberUuid);

}
