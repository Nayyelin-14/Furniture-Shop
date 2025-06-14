import { useIsFetching } from "@tanstack/react-query";
import { useNavigation } from "react-router-dom";

const Progressbar = () => {
  const navigation = useNavigation();
  const fetching = useIsFetching() > 0;

  if (fetching || navigation.state !== "idle") {
    return (
      <div className="fixed top-0 left-0 z-100 h-1 w-full overflow-hidden  bg-gray-300 ">
        <div className="absolute h-full w-2/3 bg-green-500 animate-progress" />
      </div>
    );
  }
  return null;
};

export default Progressbar;

// useIsFetching()
// ဒီ hook က React Query မှာ query fetch လုပ်နေတဲ့အချိန်တွေကိုစစ်တယ်။

// useIsFetching() က integer return ပြန်တယ်။

// 0 ဆိုရင် fetch မလုပ်ဘူး။

// 1 ဒါမှမဟုတ် 2 ဆိုရင်တော့ fetch လုပ်နေတာရှိတယ်။

// > 0 ဆိုတာကတော့ fetching ဖြစ်နေသလား စစ်တာ။

// const fetching = useIsFetching() > 0;
// ➡️ fetching က boolean ဖြစ်တယ် (true or false)

// 🔹 useNavigation()
// ဒီဟာကတော့ React Router v6.4+ ရဲ့ hook တခုပါ။

// navigation.state ဆိုတာက current navigation state ကိုပြတယ်။

// "idle" ဆိုရင် page navigation မဖြစ်ဘူး။

// "loading" ဆိုရင် route တခုကနေတခုသို့ ပြောင်းနေတယ်။

// "submitting" ဆိုရင် form submit လုပ်နေတယ်။
