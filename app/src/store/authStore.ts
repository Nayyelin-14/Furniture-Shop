import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
export enum Status {
  otp = "otp",
  confirm = "confirm",
  verify = "verify",
  reset = "reset",
  none = "none",
  change = "change",
}

type State = {
  phone: string | null;
  token: string | null;
  status: Status;
};

const initialState: State = {
  phone: null,
  token: null,
  status: Status.none,
};

type Actions = {
  //type for action to manipulate initialState
  setAuth: (phone: string, token: string, status: Status) => void;
  clearAuth: () => void;
};

const useAuthStore = create<State & Actions>()(
  // () - is required only when you're using middleware like persist, immer, or devtools. Here's why:
  // create()() → Needed when using middleware.  create() alone → Only fine when not using middleware.
  persist(
    immer((set) => ({
      ...initialState,

      setAuth: (phone, token, status) =>
        set((state) => {
          state.phone = phone;
          state.token = token;
          state.status = status;
        }),
      clearAuth: () => set(initialState),
    })),
    {
      name: "auth-credentials",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthStore;

//persist is middleware
//  store ထဲက data တွေကို browser ထဲမှာ သိမ်းထားဖို့ အသုံးပြုတာပါ။
//  ပြန် reload လုပ်လိုက်ရင် data တွေမပျက်ဘဲ မူလအတိုင်း ပြန်ရအောင်လုပ်တယ်။

//immer is middleware
// state ကို mutate (ပြောင်းလဲ) လုပ်တာကို မခက်ဘဲ လုပ်နိုင်အောင် လုပ်ပေးတယ်။
// မူရင်း state ကိုမပျက်ဘဲ copy ဖြစ်ပြီး အသစ်ပြင်တာမျိုး။
