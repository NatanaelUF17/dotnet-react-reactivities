import { createContext, useContext } from "react";
import ActivityStore from "./activity.store";

interface Store {
  activityStore: ActivityStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
};

export const StoreContext = createContext(store);

// Here we are creating our own hook to make use of the store
export function useStore() {
  return useContext(StoreContext);
}
