import { create } from 'zustand';

export interface MemoryDraft {
  type: 'photo' | 'video' | 'voice' | 'journal';
  whoseMemoryIsThis: string;
  title: string;
  narrative: string;
  date: string;
  tags: string[];
  fileUri: string | null;
}

interface MemoryStore {
  draft: MemoryDraft;
  setDraft: (updates: Partial<MemoryDraft>) => void;
  resetDraft: () => void;
  createMemory: () => Promise<{ success: boolean; message?: string }>;
  isCreating: boolean;
}

const initialDraft: MemoryDraft = {
  type: 'photo',
  whoseMemoryIsThis: 'Margaret Mitchell',
  title: '',
  narrative: '',
  date: new Date().toISOString(),
  tags: [],
  fileUri: null,
};

export const useMemoryStore = create<MemoryStore>((set, get) => ({
  draft: { ...initialDraft },
  isCreating: false,
  setDraft: (updates) => set((state) => ({ draft: { ...state.draft, ...updates } })),
  resetDraft: () => set({ draft: { ...initialDraft, date: new Date().toISOString() } }),
  createMemory: async () => {
    const { draft } = get();
    set({ isCreating: true });
    try {
      const { api } = require('@/services/api');
      const formData = new FormData();
      formData.append('type', draft.type);
      formData.append('whoseMemoryIsThis', draft.whoseMemoryIsThis);
      formData.append('title', draft.title);
      formData.append('narrative', draft.narrative);
      formData.append('date', draft.date);

      // OpenAPI spec supports comma-separated list or JSON array of tags
      formData.append('tags', JSON.stringify(draft.tags));

      if (draft.type !== 'journal' && draft.fileUri) {
        let mimeType = 'image/jpeg';
        let filename = 'photo.jpg';

        if (draft.type === 'video') {
          mimeType = 'video/mp4';
          filename = 'video.mp4';
        } else if (draft.type === 'voice') {
          mimeType = 'audio/mpeg';
          filename = 'voice.mp3';
        } else {
          const ext = draft.fileUri.split('.').pop()?.toLowerCase();
          if (ext === 'png') {
            mimeType = 'image/png';
            filename = 'photo.png';
          } else if (ext === 'heic') {
            mimeType = 'image/heic';
            filename = 'photo.heic';
          } else if (ext === 'webp') {
            mimeType = 'image/webp';
            filename = 'photo.webp';
          }
        }

        formData.append('files', {
          uri: draft.fileUri,
          type: mimeType,
          name: filename,
        } as any);
      }

      console.log('[MemoryStore] Submitting new memory to POST /memory-vault...');
      const response = await api.post('/memory-vault', formData);
      console.log('[MemoryStore] POST response:', response);

      if (response.success) {
        get().resetDraft();
        return { success: true };
      }
      return { success: false, message: response.message || 'Failed to create memory.' };
    } catch (err: any) {
      console.error('[MemoryStore] Create memory error:', err);
      return { success: false, message: err?.message || 'An error occurred while saving.' };
    } finally {
      set({ isCreating: false });
    }
  },
}));
