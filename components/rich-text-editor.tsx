"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Link2, List, ListOrdered, Image as ImageIcon, Trash2 } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  dir?: "ltr" | "rtl"
  className?: string
}

export default function RichTextEditor({ value, onChange, placeholder, dir = "ltr", className = "" }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Floating image toolbar state
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null)
  const [toolbarPos, setToolbarPos] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [imgWidth, setImgWidth] = useState<number>(100)

  // Keep external value in sync without breaking caret unexpectedly
  useEffect(() => {
    const el = editorRef.current
    if (!el) return
    if (el.innerHTML !== value) {
      el.innerHTML = value || ""
    }
  }, [value])

  const exec = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value)
    const html = editorRef.current?.innerHTML ?? ""
    onChange(html)
  }, [onChange])

  const insertHtmlAtCursor = useCallback((html: string) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) {
      editorRef.current?.insertAdjacentHTML("beforeend", html)
      onChange(editorRef.current?.innerHTML || "")
      return
    }
    const range = sel.getRangeAt(0)
    range.deleteContents()
    const temp = document.createElement("div")
    temp.innerHTML = html
    const frag = document.createDocumentFragment()
    let node: ChildNode | null
    let lastNode: ChildNode | null = null
    // eslint-disable-next-line no-cond-assign
    while ((node = temp.firstChild)) {
      lastNode = frag.appendChild(node)
    }
    range.insertNode(frag)
    if (lastNode) {
      range.setStartAfter(lastNode)
      range.collapse(true)
      sel.removeAllRanges()
      sel.addRange(range)
    }
    onChange(editorRef.current?.innerHTML || "")
  }, [onChange])

  const onInput = useCallback(() => {
    const html = editorRef.current?.innerHTML ?? ""
    onChange(html)
  }, [onChange])

  const triggerInsertImages = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const uploadImageToServer = async (file: File): Promise<string> => {
    const fd = new FormData()
    fd.append("image", file)
    fd.append("name", file.name.replace(/\.[^.]+$/, ""))
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    if (!res.ok) {
      const text = await res.text().catch(() => "")
      throw new Error(text || "Upload failed")
    }
    const data = await res.json()
    if (!data?.url) throw new Error("No URL returned")
    return data.url as string
  }

  const onFilesChosen = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setIsUploading(true)
    try {
      const urls: string[] = []
      for (const f of Array.from(files)) {
        const url = await uploadImageToServer(f)
        urls.push(url)
      }
      const html = urls.map((u) => `<p><img src="${u}" alt="" style="max-width:100%;height:auto;" /></p>`).join("")
      insertHtmlAtCursor(html)
    } catch (e) {
      // swallow; editor remains usable
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  // Image selection + toolbar positioning
  const updateToolbarPosition = useCallback((img: HTMLImageElement | null) => {
    if (!img || !containerRef.current) return
    const imgRect = img.getBoundingClientRect()
    const contRect = containerRef.current.getBoundingClientRect()
    const top = imgRect.top - contRect.top - 40 // place above image
    const left = Math.max(0, Math.min(imgRect.left - contRect.left, contRect.width - 240)) // keep within container width
    setToolbarPos({ top, left })
  }, [])

  const onEditorClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target && target.tagName === "IMG") {
      const img = target as HTMLImageElement
      setSelectedImg(img)
      // derive width percentage relative to editor width
      const editorWidth = editorRef.current?.clientWidth || img.parentElement?.clientWidth || img.width
      const pct = Math.round((img.width / editorWidth) * 100)
      setImgWidth(Math.max(5, Math.min(100, isFinite(pct) ? pct : 100)))
      updateToolbarPosition(img)
    } else {
      setSelectedImg(null)
    }
  }, [updateToolbarPosition])

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!containerRef.current) return
      const el = e.target as Node
      const withinToolbar = (containerRef.current.querySelector("[data-image-toolbar]")?.contains(el) ?? false)
      const withinImg = selectedImg ? selectedImg.contains(el) : false
      if (!withinToolbar && !withinImg) {
        setSelectedImg(null)
      }
    }
    const onWinScrollOrResize = () => {
      if (selectedImg) updateToolbarPosition(selectedImg)
    }
    document.addEventListener("click", onDocClick)
    window.addEventListener("scroll", onWinScrollOrResize, true)
    window.addEventListener("resize", onWinScrollOrResize)
    return () => {
      document.removeEventListener("click", onDocClick)
      window.removeEventListener("scroll", onWinScrollOrResize, true)
      window.removeEventListener("resize", onWinScrollOrResize)
    }
  }, [selectedImg, updateToolbarPosition])

  const applyImageWidth = useCallback((pct: number) => {
    if (!selectedImg) return
    const clamped = Math.max(5, Math.min(100, Math.round(pct)))
    selectedImg.style.width = `${clamped}%`
    selectedImg.style.height = "auto"
    setImgWidth(clamped)
    onChange(editorRef.current?.innerHTML || "")
    updateToolbarPosition(selectedImg)
  }, [onChange, selectedImg, updateToolbarPosition])

  const deleteSelectedImage = useCallback(() => {
    if (!selectedImg) return
    const toRemove = selectedImg
    const parent = toRemove.parentElement
    toRemove.remove()
    if (parent && parent.tagName === "P" && parent.textContent === "") {
      parent.remove()
    }
    setSelectedImg(null)
    onChange(editorRef.current?.innerHTML || "")
  }, [selectedImg, onChange])

  const showPlaceholder = useMemo(() => !value?.trim().length, [value])

  return (
    <div ref={containerRef} className={className} style={{ position: "relative", maxWidth: "100%" }}>
      <div className="flex items-center gap-2 mb-2">
        <Button type="button" variant="outline" onClick={() => exec("bold")}> <Bold className="h-4 w-4" /> </Button>
        <Button type="button" variant="outline" onClick={() => exec("italic")}> <Italic className="h-4 w-4" /> </Button>
        <Button type="button" variant="outline" onClick={() => exec("underline")}> <Underline className="h-4 w-4" /> </Button>
        <Button type="button" variant="outline" onClick={() => exec("insertUnorderedList")}> <List className="h-4 w-4" /> </Button>
        <Button type="button" variant="outline" onClick={() => exec("insertOrderedList")}> <ListOrdered className="h-4 w-4" /> </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            const url = window.prompt("Enter link URL")
            if (url) exec("createLink", url)
          }}
        >
          <Link2 className="h-4 w-4" />
        </Button>

        <div className="ml-auto flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onFilesChosen(e.target.files)}
            className="hidden"
          />
          <Button type="button" variant="default" onClick={triggerInsertImages}>
            <ImageIcon className="h-4 w-4 mr-2" /> Insert images
          </Button>
          {isUploading && <span className="text-sm text-gray-500">Uploading...</span>}
        </div>
      </div>

      <div className="relative">
        <div
          ref={editorRef}
          contentEditable
          dir={dir}
          className="min-h-[240px] w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-vl-blue/50"
          onInput={onInput}
          onClick={onEditorClick}
          suppressContentEditableWarning
          style={{ wordBreak: "break-word" }}
        />
        {showPlaceholder && (
          <div className="pointer-events-none absolute left-4 top-2 text-sm text-gray-400 select-none">
            {placeholder || "Write your content..."}
          </div>
        )}
      </div>

      {selectedImg && (
        <div
          data-image-toolbar
          className="absolute z-50 rounded-md border bg-vl-blue shadow-lg p-3 flex flex-col gap-2 w-[240px]"
          style={{ top: `${toolbarPos.top}px`, left: `${toolbarPos.left}px` }}
        >
          <div className="text-sm font-medium">Image controls</div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" onClick={() => applyImageWidth(25)}>25%</Button>
            <Button type="button" variant="outline" onClick={() => applyImageWidth(50)}>50%</Button>
            <Button type="button" variant="outline" onClick={() => applyImageWidth(75)}>75%</Button>
            <Button type="button" variant="outline" onClick={() => applyImageWidth(100)}>100%</Button>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min={5}
              max={100}
              value={imgWidth}
              onChange={(e) => applyImageWidth(parseInt(e.target.value))}
              className="w-full"
            />
            <span className="text-xs text-gray-600 w-10 text-right">{imgWidth}%</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-gray-500">Click outside to close</div>
            <Button type="button" variant="destructive" onClick={deleteSelectedImage}>
              <Trash2 className="h-4 w-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}



