import { interceptedAxios, handleAxiosError } from "../lib/axios";
import {
  USERS_AVATAR_UPLOAD,
  USERS_AVATAR_GET,
  USERS_AVATAR_DELETE,
} from "./endpoints";

export interface AvatarUploadResponse {
  photoUrl: string;
}

export interface AvatarUrlResponse {
  url: string | null;
}

const createAvatarService = () => {
  /**
   * Upload avatar for a user
   * @param userId User ID
   * @param file File to upload
   */
  const uploadAvatar = async (
    userId: number,
    file: File
  ): Promise<AvatarUploadResponse> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const endpoint = USERS_AVATAR_UPLOAD.replace(":id", String(userId));
      const response = await interceptedAxios.post<AvatarUploadResponse>(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  /**
   * Get avatar URL for a user
   * Returns a presigned URL (GCS) or API path (local)
   * @param userId User ID
   */
  const getAvatarUrl = async (userId: number): Promise<AvatarUrlResponse> => {
    try {
      const endpoint = USERS_AVATAR_GET.replace(":id", String(userId));
      const response = await interceptedAxios.get<AvatarUrlResponse>(endpoint);
      return response.data;
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  /**
   * Delete avatar for a user
   * @param userId User ID
   */
  const deleteAvatar = async (userId: number): Promise<void> => {
    try {
      const endpoint = USERS_AVATAR_DELETE.replace(":id", String(userId));
      await interceptedAxios.delete(endpoint);
    } catch (error) {
      throw new Error(handleAxiosError(error));
    }
  };

  return { uploadAvatar, getAvatarUrl, deleteAvatar };
};

const avatarService = createAvatarService();

export { avatarService };
