import axios from "axios";
import { sha1 } from "js-sha1";
export const deleteCloudinaryImage = async (imageId, setIsDeleted) => {
  setIsDeleted(true);
  const timestamp = Date.now() / 1000;
  await axios
    .post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/image/destroy`,
      {
        public_id: imageId,
        api_key: import.meta.env.VITE_CLOUDINARY_API_KEY,
        timestamp: timestamp,
        signature: sha1(
          `public_id=${imageId}&timestamp=${timestamp}${
            import.meta.env.VITE_CLOUDINARY_API_SECRET
          }`
        ),
      }
    )
    .then((res) => {
      setIsDeleted(false);
    });
};
