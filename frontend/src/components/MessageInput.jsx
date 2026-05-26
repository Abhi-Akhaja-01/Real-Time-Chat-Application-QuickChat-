import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, FileText, Smile, Paperclip, Mic } from "lucide-react";
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
        image: filePreview, 
      });

      setText("");
      removeFile();
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="px-4 py-3 w-full bg-base-200/90 border-t border-base-300">
      {filePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {filePreview.startsWith("data:application/pdf") ? (
              <div className="w-20 h-20 flex flex-col items-center justify-center rounded-lg border border-zinc-700 bg-base-300">
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
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-content/80 text-base-100 flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-3">
        <Smile className="size-7 text-base-content/60 cursor-pointer hover:text-base-content transition-colors flex-shrink-0" />
        
        <div className="dropdown dropdown-top flex-shrink-0">
          <label tabIndex={0} className="cursor-pointer">
            <Paperclip className="size-6 text-base-content/60 hover:text-base-content transition-colors mt-1" />
          </label>
          <ul tabIndex={0} className="dropdown-content z-50 menu p-2 shadow bg-base-200 rounded-box w-52 mb-4">
            <li><a onClick={() => imageInputRef.current?.click()}><Image className="size-4"/> Photos & Videos</a></li>
            <li><a onClick={() => pdfInputRef.current?.click()}><FileText className="size-4"/> Document</a></li>
          </ul>
        </div>
        
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={imageInputRef}
          onChange={(e) => handleFileChange(e, "image")}
        />
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          ref={pdfInputRef}
          onChange={(e) => handleFileChange(e, "pdf")}
        />

        <div className="flex-1 bg-base-100 rounded-lg overflow-hidden flex items-center shadow-sm">
          <input
            type="text"
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 px-4 py-2.5 text-base-content"
            placeholder="Type a message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        {text.trim() || filePreview ? (
           <button type="submit" className="flex-shrink-0 p-2 text-base-content/60 hover:text-base-content transition-colors">
              <Send size={24} className="fill-current" />
           </button>
        ) : (
           <button type="button" className="flex-shrink-0 p-2 text-base-content/60 hover:text-base-content transition-colors">
              <Mic size={24} />
           </button>
        )}
      </form>
    </div>
  );
};
export default MessageInput;
