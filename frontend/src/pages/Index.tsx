import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { ensureToken } from "@/lib/api";

const Index = () => {
  const [tokenReady, setTokenReady] = useState(false);

  useEffect(() => {
    ensureToken()
      .then(() => setTokenReady(true))
      .catch(() => setTokenReady(true));
  }, []);

  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" aria-hidden />

        <div className="container relative py-20 md:py-32 flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-5xl md:text-7xl font-bold tracking-tight max-w-3xl"
          >
            Trivia that actually{" "}
            <span className="inline-flex items-baseline gap-2">
              moves you{" "}
              <motion.span
                initial={{ y: 0, scale: 1 }}
                animate={{ y: [0, -6, 0], scale: [1, 1.08, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block bg-gradient-to-r from-red-500 via-red-400 to-red-500 bg-clip-text text-transparent"
              >
                up
              </motion.span>
            </span>
            .
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-6 max-w-xl text-lg text-muted-foreground"
          >
            Pick your difficulty, choose how many questions you want, and rack
            up points. Hard questions are worth more.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row gap-3"
          >
            <Button asChild size="lg" className="h-12 px-7 text-base rounded-full">
              <Link to="/setup">
                Start playing <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 px-7 text-base rounded-full"
            >
              <Link to="/stats">View stats</Link>
            </Button>
          </motion.div>

          <p className="mt-6 text-xs text-muted-foreground/80">
            {tokenReady ? "Session ready" : "Preparing your session…"}
          </p>
        </div>
      </section>

      <style>
        {`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>
    </Layout>
  );
};

export default Index;