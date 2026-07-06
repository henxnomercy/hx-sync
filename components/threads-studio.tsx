"use client"

import React, { useCallback, useMemo, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Canvas, useLoader } from "@react-three/fiber"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

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

	const handleUpload = useCallback(async (item: QueueItem, file: File) => {
		setUploading(true)
		try {
			const fd = new FormData()
			fd.append("file", file)
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
		<div className="space-y-6">
			{/* Top header / Profile widget - PRESERVE exact structure visually */}
			<div className="flex items-center justify-between rounded-lg border border-border bg-muted p-4">
				<div className="flex items-center gap-3">
					<div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background">P</div>
					<div>
						<div className="text-sm font-medium">Profile Name</div>
						<div className="text-xs text-muted-foreground">Connected as user</div>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<Button variant="outline" onClick={onDisconnect}>Disconnect</Button>
				</div>
			</div>

			{/* Discord Webhook section - PRESERVE visuals */}
			<div className="rounded-lg border border-border bg-background p-4">
				<h3 className="text-sm font-semibold">Discord Webhook</h3>
				<p className="mt-2 text-sm text-muted-foreground">Webhook URL for notifications</p>
				<div className="mt-3 flex gap-2">
					<input className="flex-1 rounded-md border border-input bg-input/10 px-3 py-2 text-sm" placeholder="https://discord.com/api/webhooks/..." />
					<Button variant="default">Save</Button>
				</div>
			</div>

			{/* Dropzone */}
			<div className="rounded-lg border border-border bg-muted p-6">
				<label className="block text-sm font-medium">Upload 2D Clothing Templates</label>
				<input
					type="file"
					accept="image/png, image/jpeg"
					multiple
					onChange={(e) => handleFiles(e.target.files)}
					className="mt-3"
				/>
			</div>

			{/* Queue list (preserve card design) */}
			<div className="space-y-4">
				{queue.map((item) => (
					<div key={item.id} className="rounded-lg border border-border bg-background p-4">
						<div className="flex items-start gap-4">
							<div className="w-28 h-28 rounded-md bg-black/20 overflow-hidden">
								<Image src={item.objectUrl} alt={item.name} width={112} height={112} className="object-cover w-full h-full" />
							</div>

							<div className="flex-1">
								<div className="flex items-center justify-between">
									<div>
										<div className="font-medium">{item.name}</div>
										<div className="text-xs text-muted-foreground">Template</div>
									</div>

									<div className="flex items-center gap-2">
										<Button variant="ghost" size="xs" onClick={() => removeItem(item.id)}>Remove</Button>
									</div>
								</div>

								{/* Clothing type toggle (shirt / pants) */}
								<div className="mt-3 inline-flex rounded-md border border-border bg-transparent">
									<button
										className={cn(
											"px-3 py-1 text-sm rounded-l-md",
											item.clothingType === "shirt" ? "bg-primary/20 text-primary" : "hover:bg-muted"
										)}
										onClick={() => setQueue((q) => q.map((it) => (it.id === item.id ? { ...it, clothingType: "shirt" } : it)))}
									>
										Shirt
									</button>
									<button
										className={cn(
											"px-3 py-1 text-sm rounded-r-md",
											item.clothingType === "pants" ? "bg-primary/20 text-primary" : "hover:bg-muted"
										)}
										onClick={() => setQueue((q) => q.map((it) => (it.id === item.id ? { ...it, clothingType: "pants" } : it)))}
									>
										Pants
									</button>
								</div>

								{/* 3D Preview Canvas (replace audio player) */}
								<div className="mt-4">
									<div className="h-72 w-full rounded-xl bg-black/20">
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

								<div className="mt-4 flex items-center gap-2">
									<Button variant="default" onClick={() => alert("Edit template (not implemented)")}>Edit</Button>
									<Button variant="secondary" onClick={() => alert("Apply to game (not implemented)")}>Apply</Button>
								</div>
							</div>
						</div>
					</div>
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

