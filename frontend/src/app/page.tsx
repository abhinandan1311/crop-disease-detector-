import { AuthProvider } from "@/components/auth-provider";
import { CropDashboard } from "@/components/crop-dashboard";

export default function Home() {
  return (
    <AuthProvider>
      <CropDashboard />
    </AuthProvider>
  );
}
