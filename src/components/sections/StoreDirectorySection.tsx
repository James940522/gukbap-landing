import { getStoreDirectory } from "@/lib/stores";
import { StoreMapSection } from "./StoreMapSection";

export async function StoreDirectorySection({
  headingLevel = 2,
}: {
  headingLevel?: 1 | 2;
} = {}) {
  const directory = await getStoreDirectory();

  return (
    <StoreMapSection
      headingLevel={headingLevel}
      initialStores={directory.stores}
      initialError={directory.error}
    />
  );
}
