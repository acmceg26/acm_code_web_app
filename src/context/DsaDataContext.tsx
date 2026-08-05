import React, { createContext, useContext, useEffect, useState } from 'react';
import { bundledTopics, topicsFromCsv, type DsaTopic } from '../lib/dsaData';
import { DSA_SHEET_CSV_URL } from '../config/sheets';

const CACHE_KEY = 'dsa_sheet_cache_v1';

type Source = 'bundled' | 'cache' | 'sheet';

interface DsaDataValue {
  topics: DsaTopic[];
  source: Source;
  loading: boolean;
}

const DsaDataContext = createContext<DsaDataValue | undefined>(undefined);

function readCache(): DsaTopic[] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as DsaTopic[]) : null;
  } catch {
    return null;
  }
}

/**
 * Supplies the DSA problem set. Instantly paints from the last cached sheet (or
 * the bundled JSON), then fetches the published Google Sheet in the background
 * and swaps it in. If the fetch fails, whatever was already showing (cache or
 * bundled) stays — the page never breaks on a network hiccup.
 */
export const DsaDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const cached = readCache();
  const [topics, setTopics] = useState<DsaTopic[]>(cached ?? bundledTopics());
  const [source, setSource] = useState<Source>(cached ? 'cache' : 'bundled');
  const [loading, setLoading] = useState<boolean>(Boolean(DSA_SHEET_CSV_URL));

  useEffect(() => {
    if (!DSA_SHEET_CSV_URL) {
      setLoading(false);
      return;
    }

    let active = true;
    (async () => {
      try {
        const res = await fetch(DSA_SHEET_CSV_URL, { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const parsed = topicsFromCsv(await res.text());
        if (!parsed.length) throw new Error('No topics parsed from sheet');
        if (!active) return;
        setTopics(parsed);
        setSource('sheet');
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(parsed));
        } catch {
          /* cache is best-effort */
        }
      } catch (e) {
        console.error('DSA sheet fetch failed — using cached/bundled data:', e);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  return (
    <DsaDataContext.Provider value={{ topics, source, loading }}>
      {children}
    </DsaDataContext.Provider>
  );
};

export function useDsaData(): DsaDataValue {
  const v = useContext(DsaDataContext);
  if (!v) throw new Error('useDsaData must be used within a DsaDataProvider');
  return v;
}
