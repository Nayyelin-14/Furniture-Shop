import { NewPwdForm } from "../../components/Auth/NewPwdForm";

const NewPwdPage = () => {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <NewPwdForm />
      </div>
    </div>
  );
};

export default NewPwdPage;
