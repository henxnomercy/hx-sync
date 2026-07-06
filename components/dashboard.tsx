"use client"

import React, { useEffect, useState } from "react"
import { Music4, Shirt, Settings } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

import { Dashboard as AudioStudio } from "./audio-studio"
import { ThreadsStudio } from "./threads-studio"

type Props = {
	credentials: any
	onDisconnect?: () => void
}

export function Dashboard({ credentials, onDisconnect }: Props) {
	const [activeMenu, setActiveMenu] = useState<string>("audio")
	const [showContent, setShowContent] = useState<boolean>(true)

	useEffect(() => {
		// small fade-out then fade-in when activeMenu changes
		setShowContent(false)
		const t = setTimeout(() => setShowContent(true), 80)
		return () => clearTimeout(t)
	}, [activeMenu])

	return (
		<div className="min-h-screen bg-background text-foreground">
			<div className="flex">
				{/* Sidebar */}
				<aside className="hidden sm:flex sm:flex-col fixed inset-y-0 left-0 w-64 bg-background border-r border-border p-4">
					<div className="flex items-center gap-2 px-2 py-3">
						<div className="h-9 w-9 rounded-md bg-primary/10 flex items-center justify-center text-primary">HX</div>
						<h1 className="text-lg font-semibold">HXSync</h1>
					</div>

					<nav className="mt-6 flex flex-col gap-2 px-2">
						<Button
							variant={activeMenu === "audio" ? "secondary" : "ghost"}
							size="default"
							className="justify-start w-full"
							onClick={() => setActiveMenu("audio")}
							data-icon="inline-start"
						>
							<Music4 className={cn("mr-2")} />
							Audio Studio
						</Button>

						<Button
							variant={activeMenu === "threads" ? "secondary" : "ghost"}
							size="default"
							className="justify-start w-full"
							onClick={() => setActiveMenu("threads")}
							data-icon="inline-start"
						>
							<Shirt className={cn("mr-2")} />
							Threads Studio
						</Button>

						<Button
							variant={activeMenu === "settings" ? "secondary" : "ghost"}
							size="default"
							className="justify-start w-full mt-2"
							onClick={() => setActiveMenu("settings")}
							data-icon="inline-start"
						>
							<Settings className={cn("mr-2")} />
							Settings
						</Button>
					</nav>

					<div className="mt-auto px-2 py-4 text-sm text-muted-foreground">
						<button
							className="text-xs text-destructive hover:underline"
							onClick={onDisconnect}
						>
							Disconnect
						</button>
					</div>
				</aside>

				{/* Main content area */}
				<main className="flex-1 min-h-screen w-full sm:ml-64">
					<div className="max-w-7xl mx-auto p-4">
						<div
							className={cn(
								"transition-opacity duration-300 ease-in-out",
								showContent ? "opacity-100" : "opacity-0"
							)}
						>
							{activeMenu === "audio" && (
								<AudioStudio credentials={credentials} onDisconnect={onDisconnect ?? (() => {})} />
							)}

							{activeMenu === "threads" && (
								<ThreadsStudio credentials={credentials} onDisconnect={onDisconnect} />
							)}

							{activeMenu === "settings" && (
								<div className="rounded-lg border border-border bg-muted p-6">
									<h2 className="text-lg font-semibold">Settings</h2>
									<p className="mt-2 text-sm text-muted-foreground">Placeholder for settings.</p>
								</div>
							)}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
