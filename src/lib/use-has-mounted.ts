import { useSyncExternalStore } from "react";

function subscribeNever() {
  return () => {};
}
function getMountedSnapshot() {
  return true;
}
function getServerSnapshot() {
  return false;
}

export function useHasMounted() {
  return useSyncExternalStore(subscribeNever, getMountedSnapshot, getServerSnapshot);
}
