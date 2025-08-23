import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import ShareModal from "./share-model";

export default function UploadZone() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [expiry, setExpiry] = useState("7d");
  const [password, setPassword] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async ({ files, expiry, password }) => {
      if (!files.length) throw new Error("No files selected");

      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("expiry", expiry);
      if (password) formData.append("password", password);

      // Use fetch directly for FormData
      try {
        const data = await apiRequest("post", "/api/upload", formData);
        return data;
      } catch (err) {
        throw new Error(err?.message || "Upload failed");
      }
    },
    onSuccess: (data) => {
      setUploadedFile(data);
      setShowShareModal(true);
      setSelectedFiles([]);
      setPassword("");

      queryClient.invalidateQueries({ queryKey: ["/api/files"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });

      toast({
        title: "Upload successful",
        description: "Your file has been uploaded and is ready to share.",
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onDrop = useCallback(
    (acceptedFiles) => {
      const maxSize = 2 * 1024 * 1024 * 1024;
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 2GB limit.`,
            variant: "destructive",
          });
          return false;
        }
        return true;
      });
      setSelectedFiles(validFiles);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
  });

  const handleUpload = () => {
    if (!selectedFiles.length) {
      toast({
        title: "No files selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate({
      files: selectedFiles,
      expiry,
      password,
    });
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <>
      <section className="mb-12">
        <div
          {...getRootProps()}
          className={`bg-white rounded-xl shadow-sm border-2 border-dashed transition-colors p-12 text-center cursor-pointer ${isDragActive ? "border-primary bg-blue-50" : "border-gray-300 hover:border-primary"
            }`}
        >
          <input {...getInputProps()} />
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <i className="fas fa-cloud-upload-alt text-2xl text-gray-400"></i>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isDragActive ? "Drop your file here" : "Drop your file here"}
          </h3>
          <p className="text-gray-600 mb-6">or click to browse from your device</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <i className="fas fa-check text-success mr-2"></i>Max 2GB per file
            </span>
            <span className="flex items-center">
              <i className="fas fa-check text-success mr-2"></i>All file types supported
            </span>
            <span className="flex items-center">
              <i className="fas fa-check text-success mr-2"></i>Secure encryption
            </span>
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <Card className="mt-4">
            <CardContent className="pt-6">
              <h4 className="font-semibold text-gray-900 mb-4">Selected Files</h4>
              {selectedFiles.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2"
                >
                  <div className="flex items-center space-x-3">
                    <i className="fas fa-file text-gray-400"></i>
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFiles((files) => files.filter((_, i) => i !== index))}
                  >
                    <i className="fas fa-times"></i>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h4 className="font-semibold text-gray-900 mb-4">Upload Options</h4>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Select value={expiry} onValueChange={setExpiry}>
                  <SelectTrigger id="expiry">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1h">1 hour</SelectItem>
                    <SelectItem value="1d">1 day</SelectItem>
                    <SelectItem value="7d">7 days</SelectItem>
                    <SelectItem value="30d">30 days</SelectItem>
                    <SelectItem value="never">Never</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="password">Password Protection</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Optional password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {selectedFiles.length} file{selectedFiles.length !== 1 ? "s" : ""} selected
              </div>
              <Button
                onClick={handleUpload}
                disabled={selectedFiles.length === 0 || uploadMutation.isLoading} // fixed
              >
                {uploadMutation.isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {uploadedFile && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setUploadedFile(null);
          }}
          uploadedFile={uploadedFile}
        />
      )}
    </>
  );
}
