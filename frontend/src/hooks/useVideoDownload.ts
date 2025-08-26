import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'react-hot-toast'
import { videoApi } from '../utils/api'

interface VideoInfo {
  id: string
  title: string
  description: string
  thumbnail: string
  duration: number
  uploader: string
  upload_date: string
  view_count: number
  platform: string
  formats: Array<{
    format_id: string
    ext: string
    quality: string
    width: number
    height: number
    filesize: number
    fps: number
    vcodec: string
    acodec: string
  }>
  available_qualities: string[]
  audio_formats: string[]
  filesize_approx: Record<string, string>
}

interface DownloadData {
  downloadUrl: string
  filename: string
  filesize: number
  quality: string
  format: string
  expires: string
}

export const useVideoDownload = () => {
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null)
  const [downloadData, setDownloadData] = useState<DownloadData | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Extract video information
  const extractMutation = useMutation({
    mutationFn: async (url: string) => {
      const response = await videoApi.extractInfo(url)
      return response.data
    },
    onSuccess: (data) => {
      setVideoInfo(data.videoInfo)
      setError(null)
      toast.success('تم تحليل الرابط بنجاح! 🎉')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || 'حدث خطأ في تحليل الرابط'
      setError(errorMessage)
      setVideoInfo(null)
      toast.error(errorMessage)
    }
  })

  // Prepare download
  const downloadMutation = useMutation({
    mutationFn: async ({ url, format, quality }: { url: string, format: string, quality: string }) => {
      const response = await videoApi.prepareDownload(url, format, quality)
      return response.data
    },
    onSuccess: (data) => {
      setDownloadData(data.download)
      setError(null)
      toast.success('الملف جاهز للتحميل! 📥')
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error?.message || 'حدث خطأ في تحضير التحميل'
      setError(errorMessage)
      setDownloadData(null)
      toast.error(errorMessage)
    }
  })

  const extractInfo = async (url: string) => {
    setDownloadData(null) // Clear previous download data
    await extractMutation.mutateAsync(url)
  }

  const prepareDownload = async (url: string, format: string, quality: string) => {
    await downloadMutation.mutateAsync({ url, format, quality })
  }

  const clearError = () => {
    setError(null)
  }

  const reset = () => {
    setVideoInfo(null)
    setDownloadData(null)
    setError(null)
  }

  return {
    // Data
    videoInfo,
    downloadData,
    error,
    
    // Loading states
    isLoading: downloadMutation.isPending,
    isExtracting: extractMutation.isPending,
    
    // Actions
    extractInfo,
    prepareDownload,
    clearError,
    reset
  }
}