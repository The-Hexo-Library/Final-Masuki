import api from "./api";

export interface BookDownloadDetails {
  fileKey: string;
  filename: string;
  fileFormat: string;
  fileSizeBytes: number;
  title: string;
  author: string;
}

/**
 * Get download information for a book without downloading it
 */
export async function getBookDownloadInfo(bookId: string): Promise<BookDownloadDetails> {
  try {
    const { data } = await api.get<{ data: BookDownloadDetails }>(`/user/books/${bookId}/download-info`);
    return data.data;
  } catch (error) {
    throw new Error(`Failed to get download info: ${error}`);
  }
}

/**
 * Download a book as a PDF or EPUB file
 */
export async function downloadBook(bookId: string, filename?: string): Promise<void> {
  try {
    const response = await api.get(`/user/books/${bookId}/download`, {
      responseType: "blob",
    });

    // Get filename from Content-Disposition header or use provided one
    let downloadFilename = filename;
    if (!downloadFilename) {
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="([^"]+)"/);
        if (matches?.[1]) {
          downloadFilename = decodeURIComponent(matches[1]);
        }
      }
      downloadFilename = downloadFilename || "book.pdf";
    }

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = downloadFilename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    throw new Error(`Failed to download book: ${error}`);
  }
}

/**
 * Download multiple books as a batch (comma-separated IDs)
 */
export async function downloadBooks(bookIds: string[]): Promise<void> {
  for (const bookId of bookIds) {
    try {
      await downloadBook(bookId);
      // Add delay between downloads to avoid overwhelming the browser
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Failed to download book ${bookId}:`, error);
    }
  }
}

/**
 * Check if a user can download a book (for UI purpose before showing button)
 */
export async function canDownloadBook(bookId: string): Promise<boolean> {
  try {
    await getBookDownloadInfo(bookId);
    return true;
  } catch {
    return false;
  }
}
