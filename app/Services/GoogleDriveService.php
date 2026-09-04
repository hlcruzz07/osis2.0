<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;

class GoogleDriveService
{
    protected Drive $drive;

    public function __construct()
    {
        $client = new Client;

        $client->setAuthConfig(base_path(env('GOOGLE_DRIVE_CREDENTIALS')));
        $client->addScope(Drive::DRIVE);

        $this->drive = new Drive($client);
    }

    public function uploadFromPath(
        string $path,
        string $filename,
        string $campus
    ): string {
        $folderId = $this->getCampusFolderId($campus);

        $metadata = new DriveFile([
            'name' => $filename,
            'parents' => [$folderId],
        ]);

        $uploaded = $this->drive->files->create(
            $metadata,
            [
                'data' => file_get_contents($path),
                'mimeType' => $this->resolveMimeType($filename),
                'uploadType' => 'multipart',
                'supportsAllDrives' => true,
                'fields' => 'id',
            ]
        );

        return $uploaded->getId();
    }

    /**
     * List files inside a campus's folder.
     *
     * @return array<int, array{id: string, name: string, mimeType: string, size: ?string, createdTime: string, webViewLink: ?string}>
     */
    public function listFilesInCampusFolder(string $campus): array
    {
        $folderId = $this->getCampusFolderId($campus);

        return $this->listFilesInFolder($folderId);
    }

    /**
     * List files inside an arbitrary folder ID.
     *
     * @return array<int, array{id: string, name: string, mimeType: string, size: ?string, createdTime: string, webViewLink: ?string}>
     */
    public function listFilesInFolder(string $folderId): array
    {
        $files = [];
        $pageToken = null;

        do {
            $response = $this->drive->files->listFiles([
                'q' => "'{$folderId}' in parents and trashed = false",
                'fields' => 'nextPageToken, files(id, name, mimeType, size, createdTime, webViewLink)',
                'supportsAllDrives' => true,
                'includeItemsFromAllDrives' => true,
                'pageToken' => $pageToken,
                'pageSize' => 100,
            ]);

            foreach ($response->getFiles() as $file) {
                $files[] = [
                    'id' => $file->getId(),
                    'name' => $file->getName(),
                    'mimeType' => $file->getMimeType(),
                    'size' => $file->getSize(),
                    'createdTime' => $file->getCreatedTime(),
                    'webViewLink' => $file->getWebViewLink(),
                ];
            }

            $pageToken = $response->getNextPageToken();
        } while ($pageToken);

        return $files;
    }

    /**
     * Fetch a single file's metadata by its Drive file ID.
     *
     * @return array{id: string, name: string, mimeType: string, size: ?string, createdTime: string, webViewLink: ?string}
     */
    public function getFileMetadata(string $fileId): array
    {
        $file = $this->drive->files->get($fileId, [
            'fields' => 'id, name, mimeType, size, createdTime, webViewLink',
            'supportsAllDrives' => true,
        ]);

        return [
            'id' => $file->getId(),
            'name' => $file->getName(),
            'mimeType' => $file->getMimeType(),
            'size' => $file->getSize(),
            'createdTime' => $file->getCreatedTime(),
            'webViewLink' => $file->getWebViewLink(),
        ];
    }

    /**
     * Download a file's raw contents by its Drive file ID.
     */
    public function downloadFile(string $fileId): string
    {
        $response = $this->drive->files->get($fileId, [
            'alt' => 'media',
            'supportsAllDrives' => true,
        ]);

        return $response->getBody()->getContents();
    }

    /**
     * Download a file to a local path.
     */
    public function downloadFileToPath(string $fileId, string $destinationPath): string
    {
        $contents = $this->downloadFile($fileId);

        file_put_contents($destinationPath, $contents);

        return $destinationPath;
    }

    /**
     * Resolve a file's MIME type purely from its extension.
     * Deliberately avoids mime_content_type()/finfo — this server
     * doesn't have the fileinfo extension (or the finfo class) at all.
     */
    private function resolveMimeType(string $filename): string
    {
        $extension = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

        return match ($extension) {
            // Images
            'bmp' => 'image/bmp',
            'jpg', 'jpeg' => 'image/jpeg',
            'png' => 'image/png',
            'gif' => 'image/gif',
            'webp' => 'image/webp',
            'svg' => 'image/svg+xml',
            'tiff', 'tif' => 'image/tiff',

            // Documents
            'pdf' => 'application/pdf',
            'doc' => 'application/msword',
            'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'xls' => 'application/vnd.ms-excel',
            'xlsx' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'ppt' => 'application/vnd.ms-powerpoint',
            'pptx' => 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'txt' => 'text/plain',
            'csv' => 'text/csv',
            'rtf' => 'application/rtf',

            // Archives
            'zip' => 'application/zip',
            'rar' => 'application/vnd.rar',
            '7z' => 'application/x-7z-compressed',

            // Video
            'mp4' => 'video/mp4',
            'mov' => 'video/quicktime',
            'avi' => 'video/x-msvideo',
            'webm' => 'video/webm',

            // Audio
            'mp3' => 'audio/mpeg',
            'wav' => 'audio/wav',

            default => 'application/octet-stream',
        };
    }

    private function getCampusFolderId(string $campus): string
    {
        $folderId = config('services.google.drive_folders.'.strtolower(trim($campus)));

        if (! $folderId) {
            throw new \InvalidArgumentException("Invalid campus: {$campus}");
        }

        return $folderId;
    }

    /**
     * Fetch an image's raw bytes and MIME type by its Drive file ID.
     * Useful for streaming a preview directly in an HTTP response.
     *
     * @return array{contents: string, mimeType: string, name: string}
     */
    public function getImage(string $fileId): array
    {
        $metadata = $this->drive->files->get($fileId, [
            'fields' => 'name, mimeType',
            'supportsAllDrives' => true,
        ]);

        $response = $this->drive->files->get($fileId, [
            'alt' => 'media',
            'supportsAllDrives' => true,
        ]);

        return [
            'contents' => $response->getBody()->getContents(),
            'mimeType' => $metadata->getMimeType() ?: $this->resolveMimeType($metadata->getName()),
            'name' => $metadata->getName(),
        ];
    }
}
