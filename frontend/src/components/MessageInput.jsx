import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, FileText } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [filePreview, setFilePreview] = useState(null);
  const imageInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const { sendMessage } = useChatStore();

  const handleFileChange = (e, expectedType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (expectedType === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (expectedType === "pdf" && file.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removeFile = () => {
    setFilePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
    if (pdfInputRef.current) pdfInputRef.current.value = "";
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !filePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: filePreview, // Backend accepts attachments via the image field
      });

      // Clear form
      setText("");
      removeFile();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full border-t border-white/5 bg-base-100/30 backdrop-blur-lg">
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {filePreview.startsWith("data:application/pdf") ? (
              <div className="w-20 h-20 flex flex-col items-center justify-center rounded-lg border border-zinc-700 bg-base-200">
                <FileText className="size-8 text-primary mb-1" />
                <span className="text-[10px] text-zinc-400">PDF</span>
              </div>
            ) : (
              <img
                src={filePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
              />
            )}
            <button
              onClick={removeFile}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          <input
            type="text"
            className="w-full input input-bordered rounded-full input-sm sm:input-md bg-base-200/50 focus:bg-base-200 transition-all duration-300 shadow-sm"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          
          {/* Image Input */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={imageInputRef}
            onChange={(e) => handleFileChange(e, "image")}
          />
          {/* PDF Input */}
          <input
            type="file"
            accept="application/pdf"
            className="hidden"
            ref={pdfInputRef}
            onChange={(e) => handleFileChange(e, "pdf")}
          />

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${filePreview && filePreview.startsWith("data:image/") ? "text-success" : "text-zinc-400"}`}
            onClick={() => imageInputRef.current?.click()}
          >
            <Image size={20} />
          </button>

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${filePreview && filePreview.startsWith("data:application/pdf") ? "text-success" : "text-zinc-400"}`}
            onClick={() => pdfInputRef.current?.click()}
          >
            <FileText size={20} />
          </button>

        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle bg-primary hover:bg-primary/90 text-primary-content shadow-lg transition-transform hover:scale-105"
          disabled={!text.trim() && !filePreview}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;
