import { ResetOTPForm } from "../../components/Auth/ResetOTP";

const VerifyOtpPage = () => {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <ResetOTPForm />
      </div>
    </div>
  );
};

export default VerifyOtpPage;
