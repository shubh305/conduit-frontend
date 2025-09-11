import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchApi } from "@/lib/api-client";

export interface LayoutConfig {
  mode: string;
  showHero: boolean;
  density: string;
}

interface SiteSettings {
  layout?: LayoutConfig;
}

export const useLayoutManager = (tenantId?: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["site-settings", tenantId];

  const { data: settings, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      return fetchApi<SiteSettings>("/site-settings", { tenantId });
    },
    enabled: !!tenantId,
  });

  const { mutateAsync: updateLayoutAsync } = useMutation({
    mutationFn: async (newLayout: Partial<LayoutConfig>) => {
      const currentLayout = settings?.layout || { mode: 'magazine', showHero: true, density: 'comfortable' };
      const mergedLayout = { ...currentLayout, ...newLayout };

      return fetchApi<SiteSettings>("/site-settings", {
        method: "PATCH",
        body: JSON.stringify({ layout: mergedLayout }),
        tenantId,
      });
    },
    onMutate: async (newLayout) => {
      await queryClient.cancelQueries({ queryKey });
      const previousSettings = queryClient.getQueryData<SiteSettings>(queryKey);

      if (previousSettings) {
         const currentLayout = previousSettings.layout || { mode: 'magazine', showHero: true, density: 'comfortable' };
         queryClient.setQueryData(queryKey, {
            ...previousSettings,
            layout: { ...currentLayout, ...newLayout }
         });
      }

      return { previousSettings };
    },
    onError: (err: unknown, newLayout: Partial<LayoutConfig>, context: { previousSettings: SiteSettings | undefined } | undefined) => {
      if (context?.previousSettings) {
        queryClient.setQueryData(queryKey, context.previousSettings);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });

  return {
    layout: settings?.layout || { mode: 'stacked', showHero: true, density: 'comfortable' },
    isLoading,
    updateLayout: updateLayoutAsync,
  };
};
