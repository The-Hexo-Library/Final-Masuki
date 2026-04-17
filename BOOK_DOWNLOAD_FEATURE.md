# Book Download Feature Implementation

This document outlines the PDF download functionality added to the MasukiBooks platform.

## Overview

Users can now download books in PDF format that they have purchased or have valid access to through an active subscription.

## Backend Implementation

### 1. BookDownloadService (`BookStorageService.java`)
**Location:** `src/main/java/com/masukibooks/service/BookDownloadService.java`

**Responsibilities:**
- Verify user access to a book (purchased, borrowed, or subscription-based)
- Check access validity (expiration for borrowed books)
- Return file metadata needed for download
- Generate appropriate download filenames

**Key Methods:**
```java
getDownloadFileKey(UUID userId, UUID bookId) 
// Returns S3 file key after verifying access

getDownloadDetails(UUID userId, UUID bookId)
// Returns complete download details including filename, format, size
```

**Access Control Logic:**
- ✅ Book must be marked as downloadable
- ✅ User must have the book in their library with "active" status
- ✅ For purchased books: always available
- ✅ For borrowed books: available only before expiration
- ✅ For users with active subscription: can access any book in their library
- ❌ Otherwise: access denied with descriptive error

### 2. BookStorageService Enhancement
**Added Method:**
```java
public InputStream downloadBookFile(String fileKey)
```
- Retrieves file from S3 bucket by key
- Returns InputStream for streaming to client
- Proper error handling with descriptive messages

### 3. UserEbookController Endpoints
**New Endpoints:**

#### GET `/user/books/{bookId}/download`
- Downloads the PDF file for a specific book
- Returns binary file with proper headers
- Content-Disposition: attachment (forces browser download)
- Requires authentication

**Response:**
- `200 OK` - File binary content
- `403 Forbidden` - User doesn't have access
- `404 Not Found` - Book not found or no file available

**Headers:**
```
Content-Type: application/pdf (or application/epub+zip)
Content-Disposition: attachment; filename="Book_Title.pdf"
Content-Length: <file-size>
```

#### GET `/user/books/{bookId}/download-info`
- Retrieves download metadata without downloading file
- Useful for UI to show download options before user clicks
- Returns filename, format, file size, etc.

**Response:**
```json
{
  "fileKey": "storage/manage/books/...",
  "filename": "Book_Title.pdf",
  "fileFormat": "pdf",
  "fileSizeBytes": 1024000,
  "title": "Book Title",
  "author": "Author Name"
}
```

## Frontend Implementation

### 1. BookDownloadService (`bookDownloadService.ts`)
**Location:** `src/services/bookDownloadService.ts`

**Functions:**
```typescript
// Get download info without downloading
getBookDownloadInfo(bookId: string): Promise<BookDownloadDetails>

// Download the book file
downloadBook(bookId: string, filename?: string): Promise<void>

// Download multiple books
downloadBooks(bookIds: string[]): Promise<void>

// Check if download is possible (for UI)
canDownloadBook(bookId: string): Promise<boolean>
```

**Features:**
- Automatic filename extraction from Content-Disposition header
- Blob-based download (works for large files)
- Error handling with user-friendly messages
- Batch download support with delays

### 2. BookDownloadButton Component
**Location:** `src/components/BookDownloadButton.tsx`

**Props:**
```typescript
interface BookDownloadButtonProps {
  bookId: string;           // Required: UUID of book to download
  filename?: string;        // Optional: custom filename
  className?: string;       // Optional: additional CSS classes
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}
```

**Features:**
- Visual loading state with spinner
- Error display inline
- Multiple style variants
- Accessible button with proper ARIA attributes
- Responsive sizing

**Usage:**
```tsx
import BookDownloadButton from "@/components/BookDownloadButton";

<BookDownloadButton 
  bookId={book.id} 
  variant="primary" 
  size="md"
/>
```

## Database Schema

The existing `books_metadata` table already supports downloads with these columns:
```sql
content_type VARCHAR(20)           -- physical, digital, both
file_key VARCHAR(500)              -- S3 key for the file
file_format VARCHAR(20)            -- pdf, epub
file_size_bytes BIGINT             -- Size in bytes
total_pages INTEGER                -- Total pages for reader
preview_pages INTEGER              -- Free preview pages
downloadable BOOLEAN               -- Allow offline download
max_downloads INTEGER              -- Per-purchase limit
```

The `user_library` table tracks access:
```sql
access_type VARCHAR(20)            -- purchased, borrowed, sample
status VARCHAR(20)                 -- active, expired, revoked
expires_at TIMESTAMP               -- For borrowed books
```

## Flow Diagram

```
User clicks "Download PDF"
         ↓
Frontend calls /user/books/{id}/download-info
         ↓
Backend verifies access (BookDownloadService)
         ├─ Book must be marked downloadable
         ├─ User must have book in library
         ├─ Check if purchased/borrowed/subscription
         └─ Check expiration (if borrowed)
         ↓
If access granted: Return download metadata
         ↓
User sees download button + file info
         ↓
User clicks button → Frontend calls /user/books/{id}/download
         ↓
Backend retrieves file from S3
         ↓
Frontend receives binary data
         ↓
Browser saves file with proper filename
```

## Security Considerations

1. **Authentication Required:** All endpoints require valid JWT token
2. **Authorization:**
   - Users can only download their own books
   - Admin users cannot bypass user access restrictions
   - Subscription status is verified in real-time

3. **File Validation:**
   - S3 key is sanitized
   - Content-Type is validated
   - File size is checked before streaming

4. **Access Logging:**
   - Downloads are logged at INFO level
   - Includes user ID, book ID, and access type

## Configuration

Add to `application.yml`:
```yaml
storage:
  s3:
    endpoint: ${S3_ENDPOINT:}
    region: ${S3_REGION:ap-northeast-2}
    access-key: ${S3_ACCESS_KEY:}
    secret-key: ${S3_SECRET_KEY:}
    bucket: ${S3_BUCKET:books}
    object-key-prefix: storage/manage/books
    public-url-prefix: ${S3_PUBLIC_URL_PREFIX:}
```

## Error Handling

**Backend Errors:**
- `400 BAD_REQUEST` - Invalid book ID or parameters
- `403 FORBIDDEN` - User lacks access to book
- `404 NOT_FOUND` - Book or file not found
- `500 SERVER_ERROR` - S3 connectivity or other server issues

**Frontend Errors:**
- Network failures display user-friendly message
- Errors are passed to error boundary
- User can retry download

## Testing

### Backend Testing
```bash
# Test download access
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8081/user/books/{bookId}/download-info

# Test actual download
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8081/user/books/{bookId}/download \
  -o book.pdf
```

### Frontend Testing
```typescript
// Check if download is available
const canDownload = await canDownloadBook(bookId);

// Test download with book in library
await downloadBook(bookId);
```

## Limitations & Future Improvements

### Current Limitations
- Only PDF and EPUB formats supported
- Single file per book (no multi-file support)
- No resume capability for interrupted downloads
- No download progress tracking

### Future Enhancements
- [ ] Download progress indicator (with Fetch API)
- [ ] Resume interrupted downloads (byte-range requests)
- [ ] Batch download as ZIP file
- [ ] Direct streaming to reader (without download)
- [ ] Download history/statistics
- [ ] Expiring download links for temporary access
- [ ] Send book via email
- [ ] Regional CDN caching for faster downloads
- [ ] Mobile app deep linking for downloads

## Troubleshooting

### User gets "Book not available for download"
- Check `downloadable` column in `books_metadata` is TRUE
- Verify file is uploaded and `file_key` is set
- Admin must explicitly enable download per book

### Download triggers but no file appears
- Check browser download settings
- Verify file size isn't too large
- Check network tab for errors (CORS, auth failures)

### S3 connection errors
- Verify `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY` are set
- Check IAM permissions in Supabase/AWS
- Verify bucket name and region

## Related Documentation
- [Project Documentation](../PROJECT_DOCUMENTATION.md) - Full API reference
- [CLAUDE.md](../CLAUDE.md) - Architecture overview
- Spring Boot Security docs: https://spring.io/projects/spring-security
