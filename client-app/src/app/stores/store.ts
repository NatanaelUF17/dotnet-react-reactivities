import { createContext, useContext } from "react";
import ActivityStore from "./activity.store";
import CommonStore from "./common.store";

interface Store {
  activityStore: ActivityStore;
  commonStore: CommonStore;
}

export const store: Store = {
  activityStore: new ActivityStore(),
  commonStore: new CommonStore(),
};

export const StoreContext = createContext(store);

// Here we are creating our own hook to make use of the store
export function useStore() {
  return useContext(StoreContext);
}
