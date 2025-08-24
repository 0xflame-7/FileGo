import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { apiRequest } from "@/lib/api";
import Header from "@/components/header";
import axiosInstance from "@/utils/axiosInstance";

export default function Download() {
  const { id } = useParams();
  const [password, setPassword] = useState("");

  const { data: fileInfo, isLoading, error } = useQuery({
    queryKey: ["/api/files", id],
    queryFn: () => apiRequest("GET", `/api/files/${id}`),
    enabled: !!id,
  });


  const downloadMutation = useMutation({
    mutationFn: async (data) => {
      const config = data.password
        ? { responseType: "blob" }
        : { responseType: "blob" };
      const body = data.password ? { password: data.password } : undefined;
      const response = await axiosInstance.request({
        method: data.password ? "POST" : "GET",
        url: `/api/download/${data.id}`,
        data: body,
        ...config,
      });
      return response.data;
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileInfo?.name || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Your file download has started successfully.");
    },
    onError: (error) => {
      toast.error(error.message || "Download failed");
    },
  });


  const handleDownload = () => {
    if (!id) return;

    if (fileInfo?.hasPassword && !password) {
      toast.error("Please enter the password to download this file.");
      return;
    }

    downloadMutation.mutate({
      id,
      password: fileInfo?.hasPassword ? password : undefined,
    });
  };

  if (isLoading) {
    return (
      <div className="font-inter bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-md mx-auto pt-16">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-gray-600">Loading file information...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !fileInfo) {
    return (
      <div className="font-inter bg-gray-50 min-h-screen">
        <Header />
        <div className="max-w-md mx-auto pt-16">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exclamation-triangle text-danger text-2xl"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">File Not Found</h3>
                <p className="text-gray-600">
                  This file may have expired, been deleted, or the link is invalid.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="font-inter bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-md mx-auto pt-16">
        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-download text-primary text-2xl"></i>
            </div>
            <CardTitle className="text-xl">Download File</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">File Details</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>File name:</span>
                  <span className="font-medium">{fileInfo.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>File size:</span>
                  <span className="font-medium">{formatFileSize(fileInfo.size)}</span>
                </div>
                {fileInfo.downloadCount !== undefined && (
                  <div className="flex justify-between">
                    <span>Downloads:</span>
                    <span className="font-medium">{fileInfo.downloadCount}</span>
                  </div>
                )}
                {fileInfo.expiresAt && (
                  <div className="flex justify-between">
                    <span>Expires:</span>
                    <span className="font-medium">{formatDate(fileInfo.expiresAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {fileInfo.hasPassword && (
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleDownload()}
                />
              </div>
            )}

            <Button
              onClick={handleDownload}
              disabled={downloadMutation.isPending}
              className="w-full"
            >
              {downloadMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download File
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
