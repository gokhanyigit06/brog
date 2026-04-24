import { useEffect, useState } from "react";
import { getSiteConfig, type SiteConfig } from "@/lib/content";

// Module-level cache — Firebase reads de-duplicated across all section components
let _cache: SiteConfig | null = null;
let _promise: Promise<SiteConfig> | null = null;

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig | null>(_cache);

  useEffect(() => {
    if (_cache) { setConfig(_cache); return; }
    if (!_promise) _promise = getSiteConfig();
    _promise.then((c) => { _cache = c; setConfig(c); });
  }, []);

  return config;
}
