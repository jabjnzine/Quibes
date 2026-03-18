'use client'

import { useRef, useState } from 'react'
import { ImagePlus, ImageOff } from 'lucide-react'
import { usePatientPhotos, useUploadPhoto } from '@/hooks/use-patient-detail'
import { AppButton, AppSkeleton } from '@/components/app'
import { showToast } from '@/lib/toast'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ''

function photoUrl(path: string) {
  return `${SUPABASE_URL}/storage/v1/object/public/clinic-photos/${path}`
}

function PhotoCell({ src, label }: { src?: string; label: 'Before' | 'After' }) {
  const isAfter = label === 'After'
  if (!src) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed aspect-square
          ${isAfter ? 'border-success/30 bg-success/5' : 'border-caramel-60 bg-caramel-30/30'}`}
      >
        <ImageOff size={24} className="text-gray-300 mb-2" />
        <span className="text-xs text-gray-400">ยังไม่มีรูป {label}</span>
      </div>
    )
  }
  return (
    <div className="relative rounded-lg overflow-hidden aspect-square border border-gray-200 bg-gray-50">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={photoUrl(src)} alt={label} className="w-full h-full object-cover" />
      <span
        className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full
          ${isAfter ? 'bg-success/80 text-white' : 'bg-copper/80 text-white'}`}
      >
        {label}
      </span>
    </div>
  )
}

interface TabBeforeAfterProps {
  patientId: string
  enabled: boolean
}

export function TabBeforeAfter({ patientId, enabled }: TabBeforeAfterProps) {
  const { data: pairs, isLoading } = usePatientPhotos(patientId, enabled)
  const uploadMutation = useUploadPhoto(patientId)
  const beforeRef = useRef<HTMLInputElement>(null)
  const afterRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState<'before' | 'after' | null>(null)

  const handleUpload = async (file: File, type: 'before' | 'after') => {
    setUploading(type)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    try {
      await uploadMutation.mutateAsync(fd)
      showToast(`อัปโหลดรูป ${type === 'before' ? 'Before' : 'After'} สำเร็จ`, 'success')
    } catch {
      showToast('อัปโหลดไม่สำเร็จ กรุณาลองใหม่', 'error')
    } finally {
      setUploading(null)
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AppSkeleton.Bone key={i} className="aspect-square rounded-xl" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Upload bar */}
      <div className="flex items-center gap-3">
        <AppButton
          variant="secondary"
          size="sm"
          leftIcon={<ImagePlus size={15} />}
          loading={uploading === 'before'}
          onClick={() => beforeRef.current?.click()}
        >
          อัปโหลด Before
        </AppButton>
        <AppButton
          variant="ghost"
          size="sm"
          leftIcon={<ImagePlus size={15} />}
          loading={uploading === 'after'}
          onClick={() => afterRef.current?.click()}
        >
          อัปโหลด After
        </AppButton>
        <input
          ref={beforeRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'before')}
        />
        <input
          ref={afterRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'after')}
        />
      </div>

      {/* Photo pairs */}
      {!pairs?.length ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ImageOff size={20} className="text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">ยังไม่มีรูปภาพ</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pairs.map((pair, i) => (
            <div key={i} className="flex flex-col gap-2">
              <p className="text-xs text-gray-400 font-medium">
                {pair.visitId ? `Visit: ${pair.visitId.slice(0, 8)}…` : 'ไม่ระบุ visit'}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <PhotoCell src={pair.before?.storagePath} label="Before" />
                <PhotoCell src={pair.after?.storagePath} label="After" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
