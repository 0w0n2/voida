package com.bbusyeo.voida.global.support;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

public final class ServerDataParser {
    private static final ObjectMapper OM = new ObjectMapper();

    private ServerDataParser() {}

    /** JSON이면 JSON으로, 아니면 query-string(k=v&k2=v2)으로 파싱 */
    public static Map<String, String> parse(String data) {
        if (data == null || data.isBlank()) return Collections.emptyMap();
        String trimmed = data.trim();

        // 1) JSON 시도
        if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
            try {
                Map<String, Object> raw = OM.readValue(
                    trimmed, new TypeReference<Map<String, Object>>() {});

                return toStringMap(raw);
            } catch (Exception ignore) {
                // fallthrough to query-string
            }
        }

        // 2) query-string 시도
        return parseQueryString(trimmed);
    }

    /** 타입 보조: 문자열 → 불리언 */
    public static boolean getBoolean(Map<String, String> m, String key, boolean def) {
        String v = m.get(key);
        if (v == null) return def;

        return "true".equalsIgnoreCase(v) || "1".equals(v) || "yes".equalsIgnoreCase(v);
    }

    /** 타입 보조: 문자열 → Enum */
    public static <E extends Enum<E>> E getEnum(Map<String, String> m, String key, Class<E> type) {
        String v = m.get(key);
        if (v == null) return null;

        try {
            return Enum.valueOf(type, v);
        } catch (Exception e) {
            return null;
        }
    }

    /** 타입 보조: 문자열 그대로 */
    public static String getText(Map<String, String> m, String key) {
        return m.get(key);
    }

    private static Map<String, String> toStringMap(Map<String, Object> src) {
        if (src == null) return Collections.emptyMap();

        Map<String, String> out = new HashMap<>(src.size());

        for (Map.Entry<String, Object> e : src.entrySet()) {
            Object v = e.getValue();
            if (v == null) continue;

            out.put(e.getKey(), (v instanceof String) ? (String) v : String.valueOf(v));
        }
        return out;
    }

    private static Map<String, String> parseQueryString(String s) {
        Map<String, String> m = new HashMap<>();

        for (String pair : s.split("&")) {
            int i = pair.indexOf('=');
            if (i < 0) continue;

            String k = URLDecoder.decode(pair.substring(0, i), StandardCharsets.UTF_8);
            String v = URLDecoder.decode(pair.substring(i + 1), StandardCharsets.UTF_8);
            m.put(k, v);
        }

        return m;
    }
}

