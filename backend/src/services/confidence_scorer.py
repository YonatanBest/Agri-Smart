def score_confidence(gemini_reco, web_results):
    # Use Gemini's confidence if available
    if isinstance(gemini_reco, dict) and gemini_reco.get("confidence"):
        try:
            return float(gemini_reco["confidence"])
        except Exception:
            pass
    # Fallback: simple agreement check
    gem_fert = gemini_reco.get("recommendation") if isinstance(gemini_reco, dict) else None
    agree_count = 0
    for w in web_results:
        if gem_fert and gem_fert.lower() in (w.get("summary", "").lower() + w.get("source", "").lower()):
            agree_count += 1
    if len(web_results) == 0:
        return 0.5
    return min(1.0, 0.5 + 0.5 * (agree_count / len(web_results))) 