import { useRouter } from "expo-router";

export function useSearchParams<T extends Record<string, string | undefined>>() {
  const router = useRouter();
  const params = router.params as T;

  console.log("Route Parameters: ", params);
  return params;
}
