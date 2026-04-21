import { Link } from "react-router-dom";
import { Logo } from "@/components/Logo";
import { ArrowUpRight } from "lucide-react";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        
        <div className="mb-4 flex items-center justify-center gap-2">
          <Logo />
          <h1 className="text-4xl font-bold">404</h1>
        </div>

        <p className="mb-4 text-xl text-muted-foreground">
          Oops! Page not found
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-1 text-primary underline hover:text-primary/90"
        >
          Let&apos;s go home 
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
};

export default NotFound;