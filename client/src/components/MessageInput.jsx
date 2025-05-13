import React, { useRef, useState } from "react";
import { Image, Send } from "lucide-react";
import { useChatStore } from "../store/useChatStore";
import { X } from "lucide-react";
import toast from "react-hot-toast";

//Message box for the user to type and upload an image.
const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const { sendMessages } = useChatStore();

  // Handle when an image file is selected from the user's device.
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image"); // Validate file type.
      return;
    }

    const maxSizeInMB = 5;
    if (file.size > maxSizeInMB * 1024 * 1024) {
      toast.error(`Image size exceeds ${maxSizeInMB}MB limit.`); // Validate file size.
      return;
    }

    // Use FileReader to convert the image file to base64 for preview and upload.
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result); // Update the image preview state.
    };
    reader.readAsDataURL(file); // Start reading the file.
  };

  // Remove the selected image and clear the input.
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Handle form submission by sending the message text and/or image.
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return; // Only send if there is content.

    try {
      await sendMessages({
        text: text.trim(),
        image: imagePreview,
      });
      // Clear the input fields after sending the message.
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      // Handle potential errors including payload size issues.
      if (error.response?.status === 413) {
        toast.error(
          "Image is too large. Please upload a file smaller than 5MB."
        );
      } else {
        console.error("Failed to send message", error);
        toast.error("Failed to send message.");
      }
    }
  };

  return (
    <div className="p-4 w-full">
      {/* If an image is selected, preview it with the option to remove it. */}
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview}
              alt="Image Preview"
              className="w-20 h-20 object-cover rounded-lg border border-b-sky-50"
            />
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300 flex items-center justify-center"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      {/* Form for sending text and/or image messages. */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Hidden file input is triggered by the image button. */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* Button to trigger the file input for image selection. */}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle ${
              imagePreview ? "text-green-500" : "text-yellow-600"
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>

        {/* Submit button for sending the message with a visual icon and disabled state when empty. */}
        <button
          type="submit"
          className="btn btn-md btn-circle"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={28} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
