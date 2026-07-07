import { ShieldCheck, Wifi, WifiOff } from "lucide-react";

type ConnectionBadge = {
  icon: typeof Wifi;
  label: string;
  className: string;
};

type GetConnectionBadgeOptions = {
  isConnected: boolean;
  isConnecting: boolean;
};

export function getConnectionBadge({
  isConnected,
  isConnecting,
}: GetConnectionBadgeOptions): ConnectionBadge {
  if (isConnected) {
    return {
      icon: Wifi,
      label: "متصل",
      className: "bg-[#E9F7EE] text-[#2F8A4E]",
    };
  }

  if (isConnecting) {
    return {
      icon: ShieldCheck,
      label: "درحال اتصال",
      className: "bg-[#FFF4E5] text-[#B46D1D]",
    };
  }

  return {
    icon: WifiOff,
    label: "قطع",
    className: "bg-[#FDECEC] text-[#C9524B]",
  };
}
