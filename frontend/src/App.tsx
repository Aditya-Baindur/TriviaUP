/**
 * App Router
 *
 * Central routing configuration for TriviaUP.
 * Defines all application routes and wraps app with global providers.
 *
 * Usage :
 *  - Maps paths to pages and utility redirects
 *
 * Routes :
 *  - "/" → Landing page
 *  - "/setup" → Game setup
 *  - "/play" → Gameplay
 *  - "/results" → Results summary
 *  - "/stats" → Player statistics
 *  - "/github" → Redirect (GitHub)
 *  - "/docs" → Redirect (Docs)
 *  - "*" → Fallback (NotFound)
 *
 * @note
 *  - Initializes API token on app load
 *  - Wraps app with React Query, Theme, Tooltip, and Toast providers
 */

import { useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ensureToken } from '@/lib/api'
import Index from '@/pages/Index.tsx'
import Setup from '@/pages/Setup.tsx'
import Play from '@/pages/Play.tsx'
import Results from '@/pages/Results.tsx'
import Stats from '@/pages/Stats.tsx'
import NotFound from '@/pages/NotFound.tsx'
import Redirect from '@/pages/Redirect'

const queryClient = new QueryClient()

const TokenBootstrap = () => {
  useEffect(() => {
    // Ensure a token exists in localStorage as soon as the website loads.
    ensureToken().catch(() => void 0)
  }, [])
  return null
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <TokenBootstrap />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/setup" element={<Setup />} />
            <Route path="/play" element={<Play />} />
            <Route path="/results" element={<Results />} />
            <Route path="/stats" element={<Stats />} />
            <Route path="/github" element={<Redirect keyName='github'/>} />
            <Route path="/docs" element={<Redirect keyName='docs'/>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
)

export default App
