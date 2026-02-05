import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { avatarService } from "../services/avatar";
import { BACKEND_BASE_URL } from "../lib/axios";

// ============ Query Key Factory ============
const avatarKeys = {
  all: ["avatars"] as const,
  url: (userId: number) => [...avatarKeys.all, "url", userId] as const,
};

/**
 * Constructs full URL for avatar images
 * If the URL is a relative path (starts with /), prepend the backend base URL
 */
const constructAvatarUrl = (url: string | null): string | null => {
  if (!url) return null;
  // If it's already an absolute URL (starts with http), return as-is
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  // If it's a relative path, prepend backend base URL
  if (url.startsWith("/")) {
    return `${BACKEND_BASE_URL}${url}`;
  }
  return url;
};

/**
 * useAvatarUrl - Hook to fetch avatar URL for a user
 * Returns a presigned URL (GCS) or full backend URL (local)
 */
export const useAvatarUrl = (userId: number | null, options?: { enabled?: boolean }) => {
  const query = useQuery({
    queryKey: avatarKeys.url(userId ?? 0),
    queryFn: () => avatarService.getAvatarUrl(userId!),
    enabled: (options?.enabled ?? true) && userId !== null && userId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes - avatar URLs don't change often
  });

  return {
    avatarUrl: constructAvatarUrl(query.data?.url ?? null),
    isLoading: query.isLoading,
    error: query.error?.message ?? null,
    refetch: query.refetch,
  };
};

/**
 * useAvatarUpload - Hook to upload avatar for a user
 */
export const useAvatarUpload = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) =>
      avatarService.uploadAvatar(userId, file),
    onSuccess: (_, { userId }) => {
      // Invalidate avatar URL cache for this user
      queryClient.invalidateQueries({ queryKey: avatarKeys.url(userId) });
      // Also invalidate employee list to update photoUrl
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/**
 * useAvatarDelete - Hook to delete avatar for a user
 */
export const useAvatarDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: number) => avatarService.deleteAvatar(userId),
    onSuccess: (_, userId) => {
      // Invalidate avatar URL cache for this user
      queryClient.invalidateQueries({ queryKey: avatarKeys.url(userId) });
      // Also invalidate employee list to update photoUrl
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
  });
};

/**
 * useAvatar - Combined hook for avatar management
 * Provides fetching, uploading, and deleting avatars
 */
export const useAvatar = (userId: number | null, options?: { enabled?: boolean }) => {
  const { avatarUrl, isLoading, error, refetch } = useAvatarUrl(userId, options);
  const uploadMutation = useAvatarUpload();
  const deleteMutation = useAvatarDelete();

  const uploadAvatar = async (file: File) => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return uploadMutation.mutateAsync({ userId, file });
  };

  const deleteAvatar = async () => {
    if (!userId) {
      throw new Error("User ID is required");
    }
    return deleteMutation.mutateAsync(userId);
  };

  return {
    // Avatar URL (already processed with full backend URL)
    avatarUrl,
    isLoading,
    error,

    // Upload
    uploadAvatar,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error?.message ?? null,

    // Delete
    deleteAvatar,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message ?? null,

    // Refetch
    refetch,
  };
};
