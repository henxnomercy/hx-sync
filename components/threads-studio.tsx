"use client"

import React, { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Canvas, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { LogOut, UploadCloud } from "lucide-react"

type QueueItem = {
	id: string
	name: string
	objectUrl: string
	clothingType: "shirt" | "pants"
}

type Props = {
	credentials: any
	onDisconnect?: () => void
}

function DummyModel({ texture, clothingType }: { texture?: THREE.Texture | null; clothingType: "shirt" | "pants" }) {
	const mat = useMemo(() => {
		const m = new THREE.MeshStandardMaterial({ color: 0xcccccc })
		if (texture) {
			m.map = texture
			m.needsUpdate = true
		}
		return m
	}, [texture])

	// simple R6 proportions
	return (
		<group rotation={[0, Math.PI, 0]}>
			{/* Head */}
			<mesh position={[0, 1.9, 0]}>
				<boxGeometry args={[0.6, 0.6, 0.6]} />
				<meshStandardMaterial color={0xf2d1c9} />
			</mesh>

			{/* Torso */}
			<mesh position={[0, 0.9, 0]}>
				<boxGeometry args={[0.9, 1.1, 0.45]} />
				{clothingType === "shirt" ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={0x444444} />}
			</mesh>

			{/* Left Arm */}
			<mesh position={[-0.75, 0.9, 0]}>
				<boxGeometry args={[0.3, 1, 0.3]} />
				{clothingType === "shirt" ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={0x666666} />}
			</mesh>

			{/* Right Arm */}
			<mesh position={[0.75, 0.9, 0]}>
				<boxGeometry args={[0.3, 1, 0.3]} />
				{clothingType === "shirt" ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={0x666666} />}
			</mesh>

			{/* Left Leg */}
			<mesh position={[-0.25, -0.6, 0]}>
				<boxGeometry args={[0.35, 1, 0.35]} />
				{clothingType === "pants" ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={0x222222} />}
			</mesh>

			{/* Right Leg */}
			<mesh position={[0.25, -0.6, 0]}>
				<boxGeometry args={[0.35, 1, 0.35]} />
				{clothingType === "pants" ? <primitive object={mat} attach="material" /> : <meshStandardMaterial color={0x222222} />}
			</mesh>
		</group>
	)
}

export function ThreadsStudio({ credentials, onDisconnect }: Props) {
	const [queue, setQueue] = useState<QueueItem[]>([])
	const [uploading, setUploading] = useState(false)

	const handleFiles = useCallback((files: FileList | null) => {
		if (!files) return
		const next = Array.from(files).map((f) => ({
			id: crypto.randomUUID(),
			name: f.name,
			objectUrl: URL.createObjectURL(f),
			clothingType: "shirt" as const,
		}))
		setQueue((s) => [...next, ...s])
	}, [])

	const handleUpload = useCallback(async (item: QueueItem) => {
		setUploading(true)
		try {
			const response = await fetch(item.objectUrl)
			const blob = await response.blob()
			const fd = new FormData()
			fd.append("file", new File([blob], item.name, { type: blob.type || "image/png" }))
			fd.append("clothingType", item.clothingType)

			const res = await fetch("/api/upload-clothing", { method: "POST", body: fd })
			if (!res.ok) throw new Error("upload failed")
			// you can handle response here
		} finally {
			setUploading(false)
		}
	}, [])

	const removeItem = useCallback((id: string) => {
		setQueue((s) => s.filter((i) => i.id !== id))
	}, [])

	return (
		<div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
			<div className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex items-center gap-3">
						<div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-primary/10 text-primary">
							<span className="text-lg font-bold">T</span>
						</div>
						<div>
							<p className="text-sm font-semibold">Threads Studio</p>
							<p className="text-xs text-muted-foreground">Connected to your Roblox creator workflow.</p>
						</div>
					</div>
					<Button variant="outline" className="h-10 gap-2 text-sm" onClick={onDisconnect}>
						<LogOut className="h-4 w-4" aria-hidden="true" />
						Disconnect
					</Button>
				</div>
			</div>

			<section className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-semibold">Discord Webhook</p>
						<p className="mt-1 text-sm text-muted-foreground">Send notifications when clothing templates are uploaded.</p>
					</div>
					<Button variant="outline" className="h-10 gap-2 text-sm">Save settings</Button>
				</div>
				<div className="mt-5 grid gap-4 sm:grid-cols-[1.7fr_0.9fr]">
					<input
						type="text"
						placeholder="https://discord.com/api/webhooks/..."
						className="h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
					/>
					<input
						type="text"
						placeholder="Discord username"
						className="h-11 w-full rounded-xl border border-border bg-background/50 px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/40"
					/>
				</div>
			</section>

			<section className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-semibold">Upload 2D Clothing Templates</p>
						<p className="mt-1 text-sm text-muted-foreground">Select one or more templates to preview on the 3D model.</p>
					</div>
					<span className="rounded-full border border-border bg-background/50 px-3 py-1 text-xs font-medium text-muted-foreground">{queue.length} queued</span>
				</div>
				<label className="mt-5 flex h-14 cursor-pointer items-center justify-center gap-3 rounded-3xl border border-dashed border-border bg-background/50 px-4 text-sm text-muted-foreground transition hover:border-primary hover:text-primary">
					<UploadCloud className="h-5 w-5" aria-hidden="true" />
					<span>Click to select PNG or JPEG templates</span>
					<input
						type="file"
						accept="image/png, image/jpeg"
						multiple
						onChange={(e) => handleFiles(e.target.files)}
						className="sr-only"
					/>
				</label>
			</section>

			<div className="space-y-4">
				{queue.map((item) => (
					<section key={item.id} className="rounded-2xl border border-border bg-card p-5 shadow-lg shadow-black/20 sm:p-6">
						<div className="flex flex-col gap-5 lg:flex-row lg:items-start">
							<div className="flex-shrink-0 overflow-hidden rounded-3xl border border-border bg-background/80 lg:w-72 lg:h-72">
								<Image src={item.objectUrl} alt={item.name} width={288} height={288} className="h-full w-full object-cover" />
							</div>
							<div className="flex-1 space-y-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div>
										<p className="text-base font-semibold">{item.name}</p>
										<p className="text-xs text-muted-foreground">Clothing template</p>
									</div>
									<Button variant="ghost" size="xs" onClick={() => removeItem(item.id)}>
										Remove
									</Button>
								</div>

								<div className="grid gap-3 sm:grid-cols-[1fr_auto]">
									<div className="inline-flex overflow-hidden rounded-full border border-border bg-background/80">
										<button
											className={cn(
												"px-3 py-2 text-sm font-medium transition",
												item.clothingType === "shirt" ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"
											)}
											onClick={() => setQueue((q) => q.map((it) => (it.id === item.id ? { ...it, clothingType: "shirt" } : it)))}
										>
											Shirt
										</button>
										<button
											className={cn(
												"px-3 py-2 text-sm font-medium transition",
												item.clothingType === "pants" ? "bg-primary/15 text-primary" : "text-foreground hover:bg-muted"
											)}
											onClick={() => setQueue((q) => q.map((it) => (it.id === item.id ? { ...it, clothingType: "pants" } : it)))}
										>
											Pants
										</button>
									</div>
									<Button variant="secondary" size="sm" onClick={() => handleUpload(item)} disabled={uploading}>
										Upload
									</Button>
								</div>

								<div className="rounded-3xl border border-border bg-background/80 p-4">
									<div className="h-72 w-full overflow-hidden rounded-3xl bg-black/10">
										<Canvas camera={{ position: [0, 1, 4] }}>
											<ambientLight intensity={0.5} />
											<directionalLight position={[10, 10, 10]} intensity={1} />
											<OrbitControls />
											<Suspense fallback={null}>
													<ModelWithTexture url={item.objectUrl} clothingType={item.clothingType} />
												</Suspense>
											</Canvas>
										</div>
									</div>
								</div>
							</div>
						</section>
					))}
				</div>
			</div>
	)
}

// small lazy-loaded texture model component
function ModelWithTexture({ url, clothingType }: { url: string; clothingType: "shirt" | "pants" }) {
	const texture = useLoader(THREE.TextureLoader, url)
	return <DummyModel texture={texture} clothingType={clothingType} />
}

// Suspense import for React
const { Suspense } = React

