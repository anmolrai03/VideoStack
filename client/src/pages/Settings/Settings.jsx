import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { User, Shield, LogOut } from "lucide-react";
import { useAuthContext } from "../../contexts/AuthContext/AuthContext";
import { useVerifyPassword, useLogout } from "../../hooks/auth/auth.hooks";
import InputField from "../../components/InputField/InputField";
import ActionButton from "../../components/ActionButton/ActionButton";

export default function Settings() {
  const { user } = useAuthContext();
  const { execute: verifyPassword, loading: verifying } = useVerifyPassword();
  const { logout, loading: loggingOut } = useLogout();
  
  const [isVerified, setIsVerified] = useState(false);

  const {
    register: registerVerify,
    handleSubmit: handleVerifySubmit,
    formState: { errors: verifyErrors }
  } = useForm();

  const onVerify = async (data) => {
    const res = await verifyPassword({ password: data.password });
    if (res.success) {
      toast.success(res.message);
      setIsVerified(true);
    } else {
      toast.error(res.message);
    }
  };

  const handleLogout = async () => {
    const res = await logout();
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
  };

  return (
    <main className="min-h-screen bg-background text-white pt-24 pb-12 px-6 md:px-12 max-w-4xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-light tracking-tight">Settings</h1>
        <p className="text-neutral-400 mt-2">Manage your account preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Info */}
        <div className="md:col-span-1 flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-neutral-800 p-6 rounded-2xl flex flex-col items-center text-center gap-4">
            <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center text-3xl font-medium">
              {user?.avatarName}
            </div>
            <div>
              <h2 className="text-xl font-medium">{user?.fullname}</h2>
              <p className="text-neutral-500 text-sm">@{user?.username}</p>
              <p className="text-neutral-500 text-sm mt-1">{user?.email}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-xl transition-colors font-medium cursor-pointer disabled:opacity-50"
          >
            <LogOut size={18} />
            {loggingOut ? "Logging out..." : "Log Out"}
          </button>
        </div>

        {/* Security Settings */}
        <div className="md:col-span-2 bg-[#0a0a0a] border border-neutral-800 p-8 rounded-2xl">
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-neutral-800">
            <Shield className="text-emerald-500" size={24} />
            <h2 className="text-xl font-medium">Security</h2>
          </div>

          {!isVerified ? (
            <div className="max-w-md">
              <p className="text-sm text-neutral-400 mb-6">
                Verify your current password to access sensitive settings.
              </p>
              <form onSubmit={handleVerifySubmit(onVerify)} className="flex flex-col gap-4">
                <InputField
                  htmlFor="verify-password"
                  labelName="CURRENT PASSWORD"
                  inputType="password"
                  placeholder="Enter your current password"
                  {...registerVerify("password", { required: "Password is required" })}
                  error={verifyErrors.password?.message}
                />
                <ActionButton 
                  buttonName="Verify Password" 
                  type="submit" 
                  loading={verifying}
                  className="mt-2"
                />
              </form>
            </div>
          ) : (
            <div className="text-emerald-500 flex flex-col gap-4">
              <p>✓ Password verified. You can now change your password.</p>
              <p className="text-sm text-neutral-400">
                (Change password backend endpoint doesn't exist yet in the codebase. You are verified!)
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
