import { Toaster as Sonner, toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { TOAST_CLASS_NAMES } from "@/components/ui/sonner-constants";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: TOAST_CLASS_NAMES,
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
