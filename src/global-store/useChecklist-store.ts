import { create } from "zustand";
import { persist } from "zustand/middleware";
import { zustandMMKVStorage } from "../blue-prints/local-store/mmkvStorageAdapter";

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

interface ChecklistState {
  checklist: Record<string, ChecklistItem[]>; // Checklists stored by date
  defaultChecklistTemplate: ChecklistItem[]; // Template checklist
  addItem: (title: string) => void;
  deleteItem: (id: string) => void;
  updateItem: (id: string, title: string) => void;
  toggleComplete: (id: string, date?: string) => void;
  initializeChecklist: (date: string) => void;
  updateDefaultChecklistTemplate: (
    newTemplate: ChecklistItem[],
    newTemplate: ChecklistItem[]
  ) => void;
  deleteFromDefaultChecklistTemplate: (id: string) => void;
  addToDefaultChecklistTemplate: (item: ChecklistItem) => void;
  resetChecklistData: () => void;
}

export const getCurrentDate = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const defaultChecklistTemplate: ChecklistItem[] = [
  { id: "1", title: "Use a gentle cleanser twice a day", completed: false },
  {
    id: "2",
    title: "Apply a hydrating toner or essence after cleansing",
    completed: false,
  },
  { id: "3", title: "Limit sugar, greasy foods, and dairy", completed: false },
  {
    id: "4",
    title:
      "Avoid touching your face, using harsh scrubs, or picking at your skin",
    completed: false,
  },
  { id: "5", title: "Wear sunscreen when out in the sun", completed: false },
];

const useChecklistStore = create<ChecklistState>()(
  persist(
    (set) => ({
      checklist: {},
      defaultChecklistTemplate,

      initializeChecklist: (date?) =>
        set((state) => {
          const selectedDate = date || getCurrentDate();
          if (state.checklist[selectedDate]) return state;

          return {
            checklist: {
              ...state.checklist,
              [selectedDate]: state.defaultChecklistTemplate,
            },
          };
        }),

      addItem: (title) =>
        set((state) => {
          const today = getCurrentDate();
          const newId = (state.checklist[today]?.length + 1).toString();
          const newItem = { id: newId, title, completed: false };
          return {
            checklist: {
              ...state.checklist,
              [today]: [...(state.checklist[today] || []), newItem],
            },
          };
        }),

      deleteItem: (id) =>
        set((state) => {
          const today = getCurrentDate();
          return {
            checklist: {
              ...state.checklist,
              [today]:
                state.checklist[today]?.filter((item) => item.id !== id) || [],
            },
          };
        }),

      updateItem: (id, title) =>
        set((state) => {
          const today = getCurrentDate();
          return {
            checklist: {
              ...state.checklist,
              [today]:
                state.checklist[today]?.map((item) =>
                  item.id === id ? { ...item, title } : item
                ) || [],
            },
          };
        }),

      toggleComplete: (id: string, date?: string) =>
        set((state) => {
          // Use the provided date or the current date if not passed
          const today = date || getCurrentDate();
          return {
            checklist: {
              ...state.checklist,
              [today]:
                state.checklist[today]?.map((item) =>
                  item.id === id
                    ? { ...item, completed: !item.completed }
                    : item
                ) || [],
            },
          };
        }),

      updateDefaultChecklistTemplate: (newTemplate, updatedChecklist) =>
        set((state) => {
          const today = getCurrentDate();
          return {
            defaultChecklistTemplate: newTemplate,
            checklist: {
              ...state.checklist,
              [today]: updatedChecklist,
            },
          };
        }),

      deleteFromDefaultChecklistTemplate: (id) =>
        set((state) => {
          const today = getCurrentDate();
          const updatedTemplate = state.defaultChecklistTemplate.filter(
            (item) => item.id !== id
          );
          return {
            defaultChecklistTemplate: updatedTemplate,
            checklist: {
              ...state.checklist,
              [today]:
                state.checklist[today]?.filter((item) => item.id !== id) || [],
            },
          };
        }),

      addToDefaultChecklistTemplate: (item) =>
        set((state) => {
          const today = getCurrentDate();
          const updatedTemplate = [...state.defaultChecklistTemplate, item];
          return {
            defaultChecklistTemplate: updatedTemplate,
            checklist: {
              ...state.checklist,
              [today]: [...(state.checklist[today] || []), item],
            },
          };
        }),
      resetChecklistData: () =>
        set(() => ({ checklist: {}, defaultChecklistTemplate })),
    }),
    {
      name: "checklist-data", // Storage key
      storage: zustandMMKVStorage,
    }
  )
);

export default useChecklistStore;
