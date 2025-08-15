import os
import re
import threading
from functools import lru_cache
from typing import Optional

from argostranslate import package as ar_package
from argostranslate import translate as ar_translate

_translator = None  # type: Optional[ar_translate.Translation]
_cache = {}  # type: dict[str, str]
_lock = threading.RLock()


def _ensure_en_ko_installed() -> None:
    """en→ko 번역 패키지가 없으면 온라인으로 자동 설치. 이미 있으면 스킵."""
    langs = ar_translate.get_installed_languages()
    has_en = any(l.code == "en" for l in langs)
    has_ko = any(l.code == "ko" for l in langs)
    if has_en and has_ko:
        en = next(l for l in langs if l.code == "en")
        if any(t for t in en.translations if t.to_lang.code == "ko"):
            return
    # 설치 시도 (네트워크 필요)
    ar_package.update_package_index()
    avail = ar_package.get_available_packages()
    en2ko = next((p for p in avail if p.from_code == "en" and p.to_code == "ko"), None)
    if en2ko is None:
        raise RuntimeError("Argos 인덱스에 en→ko 패키지가 없습니다.")
    download_path = en2ko.download()
    ar_package.install_from_path(download_path)


def get_en2ko_translator():
    """
    Argos en→ko 번역기를 전역 싱글톤으로 반환합니다.
    - 최초 호출 시 설치 보장 + 로딩 + Pre-warm
    """
    global _translator
    with _lock:
        if _translator is not None:
            return _translator

        # 설치 보장 (이미 설치되어 있으면 빠르게 통과)
        try:
            _ensure_en_ko_installed()
        except Exception:
            # 설치 실패 시에도 이후 get_installed_languages 결과로 시도
            pass

        installed_languages = ar_translate.get_installed_languages()
        en_lang = next(l for l in installed_languages if l.code == "en")
        ko_lang = next(l for l in installed_languages if l.code == "ko")
        _translator = en_lang.get_translation(ko_lang)

        # Pre-warm: 첫 호출 비용 선지불
        try:
            _ = _translator.translate("ok")
        except Exception:
            # 워밍업 실패는 무시
            pass
        return _translator


# 전처리 규칙
REWRITES = [
    (r"\bcan you hear me( now)?\b\??", "can you hear my voice now?"),
    (r"\bcan you hear me\b\??", "can you hear my voice?"),
]


def _normalize_en(text: str) -> str:
    t = (text or "").strip()
    if not t:
        return t
    total_alpha = sum(1 for ch in t if ch.isalpha())
    upper_alpha = sum(1 for ch in t if ch.isalpha() and ch.isupper())
    if total_alpha > 0 and upper_alpha >= max(1, int(0.7 * total_alpha)):
        t = t.lower()
    t = re.sub(r"\s+", " ", t)
    # 의문문 보정: 조동사/Be로 시작하는데 물음표 없으면 추가
    if re.match(
        r"^(can|do|does|did|are|is|was|were|will|would|could|should|may|might)\b",
        t,
        re.I,
    ) and not t.endswith("?"):
        t += "?"
    # 도메인 룰 적용
    for pat, rep in REWRITES:
        t = re.sub(pat, rep, t, flags=re.I)
    return t


STOP_WORDS = {
    "i",
    "you",
    "he",
    "she",
    "it",
    "we",
    "they",
    "a",
    "an",
    "the",
    "to",
    "of",
    "in",
    "on",
    "for",
    "and",
    "or",
    "but",
    "so",
    "is",
    "are",
    "am",
    "was",
    "were",
    "do",
    "does",
    "did",
    "be",
    "been",
    "have",
    "has",
    "had",
    "can",
    "could",
    "would",
    "should",
    "may",
    "might",
    "will",
    "shall",
}


def _looks_bad_ko(ko: str, src_en: str) -> bool:
    """일반화 가능한 통계 기준으로만 폴백을 트리거.
    - 길이 압축 비율: len(ko) / len(en_without_spaces) < 0.20
    - 내용어(비-스톱워드) 개수 >= 2 이면서 한국어 길이 <= 3
    """
    s = (ko or "").strip()
    en = src_en or ""
    en_ns = len(re.sub(r"\s+", "", en))
    if en_ns > 0 and (len(s) / en_ns) < 0.20:
        return True

    content = [w for w in re.findall(r"[A-Za-z']+", en.lower()) if w not in STOP_WORDS]
    if len(content) >= 2 and len(s) <= 3:
        return True

    return False


# 스타일 기본값: 환경변수 KO_STYLE로 제어(casual|polite|formal)
KO_STYLE = os.getenv("KO_STYLE", "polite").lower()

# 정규식 사전 컴파일(성능/안정성)
_RE_DANGSIN_WITH_PARTICLE = re.compile(
    r"\b당신(?:(?:은|는|이|가|을|를|에게|께서|도|만|으로|와|과))?", re.UNICODE
)
_RE_START_PARTICLE = re.compile(r"^(은|는|이|가|을|를)\s*", re.UNICODE)
_RE_SPACES = re.compile(r"\s+", re.UNICODE)
_RE_READY_DWED = re.compile(r"준비\s*됐", re.UNICODE)
_RE_DWEO_SSEUM = re.compile(r"되었\s*습니까", re.UNICODE)
_RE_Q_AUX_START = re.compile(r"^(can|are|is|do|did|will|would|could|should)\b", re.I)
_RE_POLITE_Q_END = re.compile(r"(요\?|까\?)$", re.UNICODE)
_RE_I_LOVE_YOU = re.compile(r"(?i)^\s*i\s*love\s*you[.!?]?\s*$")
_RE_HEAR = re.compile(r"\bhear\b", re.I)
_RE_KO_HEAR_KEYWORDS = re.compile(r"(목소리|소리|말)")


def _drop_second_person(s: str) -> str:
    s = _RE_DANGSIN_WITH_PARTICLE.sub("", s)
    # 문두에 조사만 남았으면 제거
    s = _RE_START_PARTICLE.sub("", s)
    # 중복 공백 정리
    s = _RE_SPACES.sub(" ", s).strip()
    return s


def _normalize_ko_surface(s: str, src_en: str, style: str) -> str:
    # 붙임표현/띄어쓰기 간단 보정
    s = _RE_READY_DWED.sub("준비됐", s)
    s = _RE_DWEO_SSEUM.sub("됐습니까", s)
    s = _RE_SPACES.sub(" ", s).strip()

    # 'I love you' 계열은 자연문으로 단순화 (기본 존댓말)
    if _RE_I_LOVE_YOU.fullmatch((src_en or "").strip()):
        if style == "casual":
            return "사랑해."
        if style == "formal":
            return "사랑합니다."
        return "사랑해요."

    # 'hear' 특화 보정: 영어 원문이 hear 계열인데 한국어에 핵심어가 없으면 자연스러운 질문으로 보정
    if _RE_HEAR.search(src_en or "") and not _RE_KO_HEAR_KEYWORDS.search(s):
        if style == "casual":
            return "내 목소리 들려?"
        if style == "formal":
            return "제 목소리 들리십니까?"
        return "지금 제 목소리 들리세요?"
    return s


def _fix_question_ending(s: str, src_en: str, style: str = "polite") -> str:
    src = (src_en or "").strip()
    is_q = src.endswith("?") or _RE_Q_AUX_START.match(src)
    if not is_q:
        return s

    # 스타일 분기
    if style == "casual":
        if _RE_READY_DWED.search(s):
            return "준비됐어?"
        if _RE_POLITE_Q_END.search(s):
            return _RE_POLITE_Q_END.sub("?", s)
        return s.rstrip("?.!") + "?"

    if style == "formal":
        if _RE_POLITE_Q_END.search(s):
            return s
        return s.rstrip("?.!") + "까?"

    # polite 기본
    if _RE_READY_DWED.search(s):
        return "준비됐어요?"
    if _RE_POLITE_Q_END.search(s):
        return s
    return s.rstrip("?.!") + "요?"


def _postprocess_ko(ko: str, src_en: str) -> str:
    s = (ko or "").strip()
    s = _drop_second_person(s)
    s = _normalize_ko_surface(s, src_en, KO_STYLE)
    s = _fix_question_ending(s, src_en, KO_STYLE)
    return s


def _m2m100_fallback(text_en: str) -> Optional[str]:
    """CTranslate2 M2M100(INT8) 폴백 번역. 모델 폴더 없거나 미설치면 None.
    - 경로: env M2M_DIR 또는 models/m2m100_418M-ct2
    - ctranslate2/transformers가 없으면 None
    """
    try:
        import importlib

        if (
            importlib.util.find_spec("ctranslate2") is None
            or importlib.util.find_spec("transformers") is None
        ):
            return None
        import ctranslate2  # type: ignore
        from transformers import M2M100Tokenizer  # type: ignore
    except Exception:
        return None

    m2m_dir = os.getenv("M2M_DIR", os.path.join("models", "m2m100_418M-ct2"))
    if not os.path.isdir(m2m_dir):
        return None

    @lru_cache(maxsize=1)
    def _m2m_tok():
        return M2M100Tokenizer.from_pretrained("facebook/m2m100_418M")

    @lru_cache(maxsize=1)
    def _m2m_tr():
        intra = max(1, (os.cpu_count() or 2) // 2)
        tr = ctranslate2.Translator(
            m2m_dir,
            device="cpu",
            compute_type="int8",
            inter_threads=1,
            intra_threads=intra,
        )
        try:
            tr.translate_batch([["<pad>"]])
        except Exception:
            pass
        return tr

    try:
        t = " ".join((text_en or "").strip().split())
        if t.isupper():
            t = t.lower()

        tok = _m2m_tok()
        tr = _m2m_tr()
        tok.src_lang = "en"
        enc = tok(t, return_tensors="pt")
        src_tokens = tok.convert_ids_to_tokens(enc["input_ids"][0].tolist())
        ko_bos = tok.convert_ids_to_tokens([tok.get_lang_id("ko")])[0]

        out = tr.translate_batch(
            [src_tokens],
            target_prefix=[[ko_bos]],
            beam_size=1,
            max_decoding_length=96,
            repetition_penalty=1.05,
        )
        hyp = out[0].hypotheses[0]
        out_ids = tok.convert_tokens_to_ids(hyp)
        return tok.batch_decode([out_ids], skip_special_tokens=True)[0]
    except Exception:
        return None


def translate_en_to_ko(text: str) -> str:
    """하이브리드 en→ko 번역: 전처리 → Argos → 휴리스틱 → 후처리/폴백 → 캐시.
    예외 시 원문 반환하여 서비스 가용성 유지."""
    key = (text or "").strip()
    if not key:
        return ""
    with _lock:
        cached = _cache.get(key)
    if cached is not None:
        return cached

    try:
        translator = get_en2ko_translator()
        pre = _normalize_en(key)
        ko = translator.translate(pre)
        if _looks_bad_ko(ko, pre):
            alt = _m2m100_fallback(pre)
            ko = alt if alt else _postprocess_ko(ko, pre)
        else:
            ko = _postprocess_ko(ko, pre)
    except Exception:
        # 번역기 미설치/오류 시 원문을 그대로 반환
        ko = key

    with _lock:
        _cache[key] = ko
    return ko
