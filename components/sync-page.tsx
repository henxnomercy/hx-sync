"use client"

import type React from "react"
import { useState } from "react"
import { Eye, EyeOff, KeyRound, Loader2, Music4, ShieldCheck, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Credentials } from "@/app/page"

type SyncPageProps = {
  onSynced: (credentials: Credentials) => void
}

export function SyncPage({ onSynced }: SyncPageProps) {
  const [groupId, setGroupId] = useState("")
  const [userId, setUserId] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [showKey, setShowKey] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!groupId.trim() || !userId.trim() || !apiKey.trim()) {
      setError("All fields are required to sync your account.")
      return
    }

    setIsSyncing(true)
    // Mock the sync/auth request
    setTimeout(() => {
      setIsSyncing(false)
      onSynced({ groupId: groupId.trim(), userId: userId.trim(), apiKey: apiKey.trim() })
    }, 1500)
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="hidden flex-col justify-center gap-10 border-r border-border bg-gradient-to-br from-primary/20 via-background to-background p-12 lg:flex">
          <div className="max-w-xl space-y-8">
            <span className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-white/5 px-4 py-2 text-sm text-primary shadow-sm shadow-primary/10">
              <Music4 className="h-5 w-5" />
              Premium Roblox creator suite
            </span>
            <div className="space-y-4">
              <h1 className="text-5xl font-semibold tracking-tight text-white">HXSync Studio</h1>
              <p className="max-w-lg text-lg leading-8 text-muted-foreground">
                The ultimate all-in-one integration suite for Roblox creators.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="rounded-3xl border border-border bg-white/5 p-5 shadow-sm shadow-black/10">
                <p className="mb-2 text-lg font-semibold text-white">🎵 Audio Studio</p>
                <p className="text-sm text-muted-foreground">Bypass limits with seamless uploads and webhook sync.</p>
              </div>
              <div className="rounded-3xl border border-border bg-white/5 p-5 shadow-sm shadow-black/10">
                <p className="mb-2 text-lg font-semibold text-white">👕 Threads Studio</p>
                <p className="text-sm text-muted-foreground">Live 3D preview and clothing uploads in one place.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md rounded-[2rem] border border-border bg-card/70 p-8 shadow-2xl shadow-black/30 backdrop-blur-xl">
            <div className="mb-8 space-y-3 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-3xl bg-primary/10 text-primary shadow-sm shadow-primary/10">
                <Music4 className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-semibold">Welcome to HXSync</h2>
              <p className="text-sm text-muted-foreground">
                Securely link your Open Cloud credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="groupId" className="text-sm font-medium text-foreground">
                  Group ID
                </label>
                <div className="relative">
                  <Users className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="groupId"
                    inputMode="numeric"
                    value={groupId}
                    onChange={(e) => setGroupId(e.target.value)}
                    placeholder="e.g. 1234567"
                    className="w-full rounded-3xl border border-border bg-background/80 px-12 py-3 text-sm text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="userId" className="text-sm font-medium text-foreground">
                  User ID
                </label>
                <div className="relative">
                  <ShieldCheck className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="userId"
                    inputMode="numeric"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="e.g. 987654321"
                    className="w-full rounded-3xl border border-border bg-background/80 px-12 py-3 text-sm text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="apiKey" className="text-sm font-medium text-foreground">
                  Open Cloud API Key
                </label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <input
                    id="apiKey"
                    type={showKey ? "text" : "password"}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Paste your secret API key"
                    autoComplete="off"
                    className="w-full rounded-3xl border border-border bg-background/80 px-12 py-3 pr-14 text-sm text-foreground outline-none transition focus:border-transparent focus:ring-2 focus:ring-primary/50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-2 text-muted-foreground transition hover:bg-white/5 hover:text-foreground"
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                  >
                    {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="rounded-3xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSyncing}
                className="flex w-full items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-3 text-sm font-semibold text-background shadow-lg shadow-primary/20 transition hover:shadow-xl hover:shadow-primary/30 disabled:opacity-70"
              >
                {isSyncing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Syncing account...
                  </>
                ) : (
                  "Sync Account"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm leading-6 text-muted-foreground">
              Your API key is only stored in memory for this session and never leaves your browser in this demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
