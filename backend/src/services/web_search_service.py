from langchain_tavily import TavilySearch
from datetime import datetime

# You may need to set TAVILY_API_KEY in your environment for Tavily
# For Bing/SerpAPI, you would use their respective tools and set their API keys

async def search_web(query):
    print("[AGENT] Using TavilySearch tool for web validation...")
    print(f"[AGENT] Query: {query}")
    search = TavilySearch()
    results = search.invoke({"query": query, "max_results": 5})
    print(f"[AGENT] TavilySearch results: {results}")
    # If results is a dict with 'results', extract those
    if isinstance(results, dict) and 'results' in results:
        results = results['results']
    trusted_domains = [
        ".gov", ".edu", "fertilizer.org", "ifdc.org", "agriculture.com", "sciencedirect.com", "researchgate.net"
    ]
    filtered = []
    for r in results if isinstance(results, list) else []:
        url = r.get("url", "")
        timestamp = r.get("timestamp") or datetime.utcnow().isoformat()
        if any(domain in url for domain in trusted_domains):
            filtered.append({
                "source": r.get("title", "unknown"),
                "url": url,
                "summary": r.get("content", r.get("snippet", "")),
                "timestamp": timestamp
            })
    if not filtered:
        filtered = [
            {
                "source": r.get("title", "unknown"),
                "url": r.get("url", ""),
                "summary": r.get("content", r.get("snippet", "")),
                "timestamp": r.get("timestamp") or datetime.utcnow().isoformat()
            } for r in results if isinstance(results, list)
        ]
    return filtered