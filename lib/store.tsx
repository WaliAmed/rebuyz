"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast, Toaster } from "sonner";
import { DemoState, seedState, unifyCustomer } from "./data";
import { productPhotos } from "./product-photos";
import { addToCart } from "./demo-actions";
const KEY = "torque-demo-v1";
const wait = () => new Promise((r) => setTimeout(r, 280));
const read = (): DemoState => {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.version === 1) {
        // Upgrade only the original placeholder branding; preserve custom settings.
        if (parsed.settings.name === "TORQUE")
          parsed.settings.name = "ZAHID AUTOS";
        if (parsed.settings.email === "hello@torque.example")
          parsed.settings.email = "hello@zahidautos.example";
        if (parsed.settings.holder === "Torque Automotive (Demo)")
          parsed.settings.holder = "Zahid Autos (Demo)";
        // Replace only the original generated art, preserving user-added photos.
        const upgradePhoto = (product: DemoState["products"][number]) => {
          if (
            /^\/images\/.*\.svg$/.test(product.image) &&
            productPhotos[product.id]
          ) {
            product.image = productPhotos[product.id].image;
          }
        };
        parsed.products.forEach(upgradePhoto);
        parsed.orders.forEach((order: DemoState["orders"][number]) =>
          order.items.forEach(({ product }) => upgradePhoto(product)),
        );
        return unifyCustomer(parsed);
      }
    }
  } catch {}
  return seedState();
};
const Context = createContext<ReturnType<typeof useModel> | null>(null);
function useModel() {
  const client = useQueryClient();
  const [scenario, setScenario] = useState("normal");
  const query = useQuery({
    queryKey: ["demo"],
    queryFn: async () => {
      await wait();
      return read();
    },
    staleTime: Infinity,
  });
  const mutation = useMutation({
    scope: { id: "demo-write" },
    mutationFn: async (change: (s: DemoState) => void) => {
      await wait();
      const next = structuredClone(
        client.getQueryData<DemoState>(["demo"]) ?? read(),
      );
      change(next);
      try {
        localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        throw new Error(
          "Demo storage is full. Remove a large photo or reset the demo.",
        );
      }
      client.setQueryData(["demo"], next);
      return next;
    },
  });
  const update = async (fn: (s: DemoState) => void, message?: string) => {
    if (scenario === "error") {
      toast.error(
        "Simulated request failure. Switch Demo state to Normal and retry.",
      );
      return false;
    }
    try {
      await mutation.mutateAsync(fn);
      if (message) toast.success(message);
      return true;
    } catch (error) {
      if (error instanceof Error) toast.error(error.message);
      return false;
    }
  };
  useEffect(() => {
    const sync = (e: StorageEvent) => {
      if (e.key === KEY) client.setQueryData(["demo"], read());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [client]);
  const state = query.data ?? seedState();
  const favorite = (id: string) =>
    update(
      (s) => {
        s.favorites = s.favorites.includes(id)
          ? s.favorites.filter((x) => x !== id)
          : [...s.favorites, id];
      },
      state.favorites.includes(id)
        ? "Removed from saved items"
        : "Saved to favorites",
    );
  const addCart = (id: string, quantity = 1) =>
    update((s) => addToCart(s, id, quantity), "Added to your cart");
  const switchRole = (role: string) =>
    update((s) => {
      s.role =
        role === "visitor"
          ? "visitor"
          : role === "admin"
            ? "admin"
            : "customer";
      s.userId = "buyer";
    }, "Demo account switched");
  return {
    state,
    update,
    favorite,
    addCart,
    switchRole,
    scenario,
    setScenario,
    loading: query.isLoading || scenario === "loading",
    busy: mutation.isPending,
    reset: async () => {
      localStorage.removeItem(KEY);
      client.setQueryData(["demo"], seedState());
      setScenario("normal");
      toast.success("Demo reset to its original data");
    },
  };
}
function Model({ children }: { children: ReactNode }) {
  const model = useModel();
  return (
    <Context.Provider value={model}>
      {children}
      <Toaster position="bottom-right" richColors closeButton />
    </Context.Provider>
  );
}
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <Model>{children}</Model>
    </QueryClientProvider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("Missing demo provider");
  return value;
}
export function recordActivity(s: DemoState, text: string, userId?: string) {
  s.activity.unshift(text);
  if (userId)
    s.notifications.unshift({
      id: crypto.randomUUID(),
      title: text,
      read: false,
      userId,
    });
}
