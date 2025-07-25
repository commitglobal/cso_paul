import { unstable_createAdapterProvider } from "nuqs/adapters/custom";
import { useNuqsInertiaAdapter } from "./nuqs-inertia-adapter";

export const NuqsInertiaAdapter = unstable_createAdapterProvider(useNuqsInertiaAdapter);
