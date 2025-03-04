import { DEFAULT_LIMIT } from "@/constants";
import StudioView from "@/modules/studio/ui/view/studioView";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
    void trpc.studio.getMany.prefetchInfinite({ limit: DEFAULT_LIMIT });
    return (
        <HydrateClient>
            <StudioView />
        </HydrateClient>
    );
};

export default Page;
