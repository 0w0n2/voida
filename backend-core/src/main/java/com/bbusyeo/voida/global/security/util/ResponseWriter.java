package com.bbusyeo.voida.global.security.util;

import com.bbusyeo.voida.global.response.BaseResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class ResponseWriter {

    public static void writeResponse (HttpServletResponse response, ObjectMapper objectMapper, BaseResponse<?> baseResponse) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        String jsonResponse = objectMapper.writeValueAsString(baseResponse);
        response.getWriter().write(jsonResponse);
    }
}
