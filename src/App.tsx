import { useLayoutEffect, useRef } from "react";
import { Outlet, useLocation, useNavigationType } from "react-router-dom";

function getLocationKey(pathname: string, search: string) {
  return `${pathname}${search}`;
}

const RESTORE_MAX_ATTEMPTS = 80;
const RESTORE_INTERVAL_MS = 50;

function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positionsRef = useRef<Map<string, number>>(new Map());
  const restoreTimerRef = useRef<number | null>(null);
  const restoreFrameRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const positions = positionsRef.current;

    if (restoreTimerRef.current !== null) {
      window.clearTimeout(restoreTimerRef.current);
      restoreTimerRef.current = null;
    }
    if (restoreFrameRef.current !== null) {
      window.cancelAnimationFrame(restoreFrameRef.current);
      restoreFrameRef.current = null;
    }

    const locationKey = getLocationKey(location.pathname, location.search);
    const targetScrollY =
      navigationType === "POP" ? (positions.get(locationKey) ?? 0) : 0;

    let attempts = 0;
    const tryRestore = () => {
      window.scrollTo(0, targetScrollY);
      const maxScrollY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const reached = Math.abs(window.scrollY - targetScrollY) <= 2;
      const enoughHeight = maxScrollY >= targetScrollY;
      if (reached || enoughHeight || attempts >= RESTORE_MAX_ATTEMPTS) return;

      attempts += 1;
      restoreFrameRef.current = window.requestAnimationFrame(() => {
        restoreTimerRef.current = window.setTimeout(
          tryRestore,
          RESTORE_INTERVAL_MS,
        );
      });
    };

    tryRestore();

    return () => {
      const currentY = window.scrollY;
      positions.set(locationKey, currentY);
      if (restoreTimerRef.current !== null) {
        window.clearTimeout(restoreTimerRef.current);
      }
      if (restoreFrameRef.current !== null) {
        window.cancelAnimationFrame(restoreFrameRef.current);
      }
    };
  }, [location.key, location.pathname, location.search, navigationType]);

  return null;
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Outlet />
    </>
  );
}
