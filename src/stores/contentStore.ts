import { create } from "zustand";
import { PageContent } from "@/types";
import { publicApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/utils";

interface ContentState {
  content: PageContent | null;
  isLoading: boolean;
  error: string | null;
  fetchContent: () => Promise<void>;
}

export const useContentStore = create<ContentState>((set) => ({
  content: null,
  isLoading: false,
  error: null,

  fetchContent: async () => {
    try {
      set({ isLoading: true, error: null });
      const { data } = await publicApi.get("/public/content");
      set({ content: data.data, isLoading: false });
    } catch (error: unknown) {
      set({
        error: getApiErrorMessage(error, "Failed to load content"),
        isLoading: false,
      });
    }
  },
}));
