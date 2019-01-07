/// <reference path="./dropbox_types.d.ts" />
declare module DropboxTypes {
  class Dropbox extends DropboxBase {
    /**
     * The Dropbox SDK class.
     */
    constructor(options: DropboxOptions);



    /**
     * Creates an OAuth 2.0 access token from the supplied OAuth 1.0 access
     * token.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<auth.TokenFromOAuth1Error>.
     * @param arg The request parameters.
     */
    public authTokenFromOauth1(arg: auth.TokenFromOAuth1Arg): Promise<auth.TokenFromOAuth1Result>;

    /**
     * Disables the access token used to authenticate the call.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public authTokenRevoke(arg: void): Promise<void>;

    /**
     * Removes all manually added contacts. You'll still keep contacts who are
     * on your team or who you imported. New contacts will be added when you
     * share.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public contactsDeleteManualContacts(arg: void): Promise<void>;

    /**
     * Removes manually added contacts from the given list.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<contacts.DeleteManualContactsError>.
     * @param arg The request parameters.
     */
    public contactsDeleteManualContactsBatch(arg: contacts.DeleteManualContactsArg): Promise<void>;

    /**
     * Add property groups to a Dropbox file. See templatesAddForUser() or
     * templatesAddForTeam() to create new templates.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.AddPropertiesError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesAdd(arg: file_properties.AddPropertiesArg): Promise<void>;

    /**
     * Overwrite property groups associated with a file. This endpoint should be
     * used instead of propertiesUpdate() when property groups are being updated
     * via a "snapshot" instead of via a "delta". In other words, this endpoint
     * will delete all omitted fields from a property group, whereas
     * propertiesUpdate() will only delete fields that are explicitly marked for
     * deletion.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.InvalidPropertyGroupError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesOverwrite(arg: file_properties.OverwritePropertyGroupArg): Promise<void>;

    /**
     * Permanently removes the specified property group from the file. To remove
     * specific property field key value pairs, see propertiesUpdate(). To
     * update a template, see templatesUpdateForUser() or
     * templatesUpdateForTeam(). To remove a template, see
     * templatesRemoveForUser() or templatesRemoveForTeam().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.RemovePropertiesError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesRemove(arg: file_properties.RemovePropertiesArg): Promise<void>;

    /**
     * Search across property templates for particular property field values.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.PropertiesSearchError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesSearch(arg: file_properties.PropertiesSearchArg): Promise<file_properties.PropertiesSearchResult>;

    /**
     * Once a cursor has been retrieved from propertiesSearch(), use this to
     * paginate through all search results.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.PropertiesSearchContinueError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesSearchContinue(arg: file_properties.PropertiesSearchContinueArg): Promise<file_properties.PropertiesSearchResult>;

    /**
     * Add, update or remove properties associated with the supplied file and
     * templates. This endpoint should be used instead of propertiesOverwrite()
     * when property groups are being updated via a "delta" instead of via a
     * "snapshot" . In other words, this endpoint will not delete any omitted
     * fields from a property group, whereas propertiesOverwrite() will delete
     * any fields that are omitted from a property group.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.UpdatePropertiesError>.
     * @param arg The request parameters.
     */
    public filePropertiesPropertiesUpdate(arg: file_properties.UpdatePropertiesArg): Promise<void>;

    /**
     * Add a template associated with a team. See propertiesAdd() to add
     * properties to a file or folder. Note: this endpoint will create
     * team-owned templates.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.ModifyTemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesAddForTeam(arg: file_properties.AddTemplateArg): Promise<file_properties.AddTemplateResult>;

    /**
     * Add a template associated with a user. See propertiesAdd() to add
     * properties to a file. This endpoint can't be called on a team member or
     * admin's behalf.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.ModifyTemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesAddForUser(arg: file_properties.AddTemplateArg): Promise<file_properties.AddTemplateResult>;

    /**
     * Get the schema for a specified template.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesGetForTeam(arg: file_properties.GetTemplateArg): Promise<file_properties.GetTemplateResult>;

    /**
     * Get the schema for a specified template. This endpoint can't be called on
     * a team member or admin's behalf.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesGetForUser(arg: file_properties.GetTemplateArg): Promise<file_properties.GetTemplateResult>;

    /**
     * Get the template identifiers for a team. To get the schema of each
     * template use templatesGetForTeam().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesListForTeam(arg: void): Promise<file_properties.ListTemplateResult>;

    /**
     * Get the template identifiers for a team. To get the schema of each
     * template use templatesGetForUser(). This endpoint can't be called on a
     * team member or admin's behalf.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesListForUser(arg: void): Promise<file_properties.ListTemplateResult>;

    /**
     * Permanently removes the specified template created from
     * templatesAddForUser(). All properties associated with the template will
     * also be removed. This action cannot be undone.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesRemoveForTeam(arg: file_properties.RemoveTemplateArg): Promise<void>;

    /**
     * Permanently removes the specified template created from
     * templatesAddForUser(). All properties associated with the template will
     * also be removed. This action cannot be undone.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesRemoveForUser(arg: file_properties.RemoveTemplateArg): Promise<void>;

    /**
     * Update a template associated with a team. This route can update the
     * template name, the template description and add optional properties to
     * templates.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.ModifyTemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesUpdateForTeam(arg: file_properties.UpdateTemplateArg): Promise<file_properties.UpdateTemplateResult>;

    /**
     * Update a template associated with a user. This route can update the
     * template name, the template description and add optional properties to
     * templates. This endpoint can't be called on a team member or admin's
     * behalf.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.ModifyTemplateError>.
     * @param arg The request parameters.
     */
    public filePropertiesTemplatesUpdateForUser(arg: file_properties.UpdateTemplateArg): Promise<file_properties.UpdateTemplateResult>;

    /**
     * Creates a file request for this user.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_requests.CreateFileRequestError>.
     * @param arg The request parameters.
     */
    public fileRequestsCreate(arg: file_requests.CreateFileRequestArgs): Promise<file_requests.FileRequest>;

    /**
     * Returns the specified file request.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_requests.GetFileRequestError>.
     * @param arg The request parameters.
     */
    public fileRequestsGet(arg: file_requests.GetFileRequestArgs): Promise<file_requests.FileRequest>;

    /**
     * Returns a list of file requests owned by this user. For apps with the app
     * folder permission, this will only return file requests with destinations
     * in the app folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_requests.ListFileRequestsError>.
     * @param arg The request parameters.
     */
    public fileRequestsList(arg: void): Promise<file_requests.ListFileRequestsResult>;

    /**
     * Update a file request.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<file_requests.UpdateFileRequestError>.
     * @param arg The request parameters.
     */
    public fileRequestsUpdate(arg: file_requests.UpdateFileRequestArgs): Promise<file_requests.FileRequest>;

    /**
     * Returns the metadata for a file or folder. This is an alpha endpoint
     * compatible with the properties API. Note: Metadata for the root folder is
     * unsupported.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.AlphaGetMetadataError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesAlphaGetMetadata(arg: files.AlphaGetMetadataArg): Promise<files.FileMetadataReference|files.FolderMetadataReference|files.DeletedMetadataReference>;

    /**
     * Create a new file with the contents provided in the request. Note that
     * this endpoint is part of the properties API alpha and is slightly
     * different from upload(). Do not use this to upload a file larger than 150
     * MB. Instead, create an upload session with uploadSessionStart().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.UploadErrorWithProperties>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesAlphaUpload(arg: files.CommitInfoWithProperties): Promise<files.FileMetadata>;

    /**
     * Copy a file or folder to a different location in the user's Dropbox. If
     * the source path is a folder all its contents will be copied.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.RelocationError>.
     * @param arg The request parameters.
     */
    public filesCopyV2(arg: files.RelocationArg): Promise<files.RelocationResult>;

    /**
     * Copy a file or folder to a different location in the user's Dropbox. If
     * the source path is a folder all its contents will be copied.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.RelocationError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesCopy(arg: files.RelocationArg): Promise<files.FileMetadataReference|files.FolderMetadataReference|files.DeletedMetadataReference>;

    /**
     * Copy multiple files or folders to different locations at once in the
     * user's Dropbox. This route will replace copyBatch(). The main difference
     * is this route will return stutus for each entry, while copyBatch() raises
     * failure if any entry fails. This route will either finish synchronously,
     * or return a job ID and do the async copy job in background. Please use
     * copyBatchCheckV2() to check the job status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesCopyBatchV2(arg: files.CopyBatchArg): Promise<files.RelocationBatchV2Launch>;

    /**
     * Copy multiple files or folders to different locations at once in the
     * user's Dropbox. If RelocationBatchArg.allow_shared_folder is false, this
     * route is atomic. If one entry fails, the whole transaction will abort. If
     * RelocationBatchArg.allow_shared_folder is true, atomicity is not
     * guaranteed, but it allows you to copy the contents of shared folders to
     * new locations. This route will return job ID immediately and do the async
     * copy job in background. Please use copyBatchCheck() to check the job
     * status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesCopyBatch(arg: files.RelocationBatchArg): Promise<files.RelocationBatchLaunch>;

    /**
     * Returns the status of an asynchronous job for copyBatchV2(). It returns
     * list of results for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesCopyBatchCheckV2(arg: async.PollArg): Promise<files.RelocationBatchV2JobStatus>;

    /**
     * Returns the status of an asynchronous job for copyBatch(). If success, it
     * returns list of results for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesCopyBatchCheck(arg: async.PollArg): Promise<files.RelocationBatchJobStatus>;

    /**
     * Get a copy reference to a file or folder. This reference string can be
     * used to save that file or folder to another user's Dropbox by passing it
     * to copyReferenceSave().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.GetCopyReferenceError>.
     * @param arg The request parameters.
     */
    public filesCopyReferenceGet(arg: files.GetCopyReferenceArg): Promise<files.GetCopyReferenceResult>;

    /**
     * Save a copy reference returned by copyReferenceGet() to the user's
     * Dropbox.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.SaveCopyReferenceError>.
     * @param arg The request parameters.
     */
    public filesCopyReferenceSave(arg: files.SaveCopyReferenceArg): Promise<files.SaveCopyReferenceResult>;

    /**
     * Create a folder at a given path.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.CreateFolderError>.
     * @param arg The request parameters.
     */
    public filesCreateFolderV2(arg: files.CreateFolderArg): Promise<files.CreateFolderResult>;

    /**
     * Create a folder at a given path.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.CreateFolderError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesCreateFolder(arg: files.CreateFolderArg): Promise<files.FolderMetadata>;

    /**
     * Create multiple folders at once. This route is asynchronous for large
     * batches, which returns a job ID immediately and runs the create folder
     * batch asynchronously. Otherwise, creates the folders and returns the
     * result synchronously for smaller inputs. You can force asynchronous
     * behaviour by using the CreateFolderBatchArg.force_async flag.  Use
     * createFolderBatchCheck() to check the job status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesCreateFolderBatch(arg: files.CreateFolderBatchArg): Promise<files.CreateFolderBatchLaunch>;

    /**
     * Returns the status of an asynchronous job for createFolderBatch(). If
     * success, it returns list of result for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesCreateFolderBatchCheck(arg: async.PollArg): Promise<files.CreateFolderBatchJobStatus>;

    /**
     * Delete the file or folder at a given path. If the path is a folder, all
     * its contents will be deleted too. A successful response indicates that
     * the file or folder was deleted. The returned metadata will be the
     * corresponding FileMetadata or FolderMetadata for the item at time of
     * deletion, and not a DeletedMetadata object.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.DeleteError>.
     * @param arg The request parameters.
     */
    public filesDeleteV2(arg: files.DeleteArg): Promise<files.DeleteResult>;

    /**
     * Delete the file or folder at a given path. If the path is a folder, all
     * its contents will be deleted too. A successful response indicates that
     * the file or folder was deleted. The returned metadata will be the
     * corresponding FileMetadata or FolderMetadata for the item at time of
     * deletion, and not a DeletedMetadata object.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.DeleteError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesDelete(arg: files.DeleteArg): Promise<files.FileMetadataReference|files.FolderMetadataReference|files.DeletedMetadataReference>;

    /**
     * Delete multiple files/folders at once. This route is asynchronous, which
     * returns a job ID immediately and runs the delete batch asynchronously.
     * Use deleteBatchCheck() to check the job status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesDeleteBatch(arg: files.DeleteBatchArg): Promise<files.DeleteBatchLaunch>;

    /**
     * Returns the status of an asynchronous job for deleteBatch(). If success,
     * it returns list of result for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesDeleteBatchCheck(arg: async.PollArg): Promise<files.DeleteBatchJobStatus>;

    /**
     * Download a file from a user's Dropbox.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.DownloadError>.
     * @param arg The request parameters.
     */
    public filesDownload(arg: files.DownloadArg): Promise<files.FileMetadata>;

    /**
     * Download a folder from the user's Dropbox, as a zip file. The folder must
     * be less than 20 GB in size and have fewer than 10,000 total files. The
     * input cannot be a single file. Any single file must be less than 4GB in
     * size.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.DownloadZipError>.
     * @param arg The request parameters.
     */
    public filesDownloadZip(arg: files.DownloadZipArg): Promise<files.DownloadZipResult>;

    /**
     * Returns the metadata for a file or folder. Note: Metadata for the root
     * folder is unsupported.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.GetMetadataError>.
     * @param arg The request parameters.
     */
    public filesGetMetadata(arg: files.GetMetadataArg): Promise<files.FileMetadataReference|files.FolderMetadataReference|files.DeletedMetadataReference>;

    /**
     * Get a preview for a file. Currently, PDF previews are generated for files
     * with the following extensions: .ai, .doc, .docm, .docx, .eps, .odp, .odt,
     * .pps, .ppsm, .ppsx, .ppt, .pptm, .pptx, .rtf. HTML previews are generated
     * for files with the following extensions: .csv, .ods, .xls, .xlsm, .xlsx.
     * Other formats will return an unsupported extension error.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.PreviewError>.
     * @param arg The request parameters.
     */
    public filesGetPreview(arg: files.PreviewArg): Promise<files.FileMetadata>;

    /**
     * Get a temporary link to stream content of a file. This link will expire
     * in four hours and afterwards you will get 410 Gone. So this URL should
     * not be used to display content directly in the browser.  Content-Type of
     * the link is determined automatically by the file's mime type.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.GetTemporaryLinkError>.
     * @param arg The request parameters.
     */
    public filesGetTemporaryLink(arg: files.GetTemporaryLinkArg): Promise<files.GetTemporaryLinkResult>;

    /**
     * Get a one-time use temporary upload link to upload a file to a Dropbox
     * location.  This endpoint acts as a delayed upload(). The returned
     * temporary upload link may be used to make a POST request with the data to
     * be uploaded. The upload will then be perfomed with the CommitInfo
     * previously provided to getTemporaryUploadLink() but evaluated only upon
     * consumption. Hence, errors stemming from invalid CommitInfo with respect
     * to the state of the user's Dropbox will only be communicated at
     * consumption time. Additionally, these errors are surfaced as generic HTTP
     * 409 Conflict responses, potentially hiding issue details. The maximum
     * temporary upload link duration is 4 hours. Upon consumption or
     * expiration, a new link will have to be generated. Multiple links may
     * exist for a specific upload path at any given time.  The POST request on
     * the temporary upload link must have its Content-Type set to
     * "application/octet-stream".  Example temporary upload link consumption
     * request:  curl -X POST
     * https://dl.dropboxusercontent.com/apitul/1/bNi2uIYF51cVBND --header
     * "Content-Type: application/octet-stream" --data-binary @local_file.txt  A
     * successful temporary upload link consumption request returns the content
     * hash of the uploaded data in JSON format.  Example succesful temporary
     * upload link consumption response: {"content-hash":
     * "599d71033d700ac892a0e48fa61b125d2f5994"}  An unsuccessful temporary
     * upload link consumption request returns any of the following status
     * codes:  HTTP 400 Bad Request: Content-Type is not one of
     * application/octet-stream and text/plain or request is invalid. HTTP 409
     * Conflict: The temporary upload link does not exist or is currently
     * unavailable, the upload failed, or another error happened. HTTP 410 Gone:
     * The temporary upload link is expired or consumed.  Example unsuccessful
     * temporary upload link consumption response: Temporary upload link has
     * been recently consumed.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesGetTemporaryUploadLink(arg: files.GetTemporaryUploadLinkArg): Promise<files.GetTemporaryUploadLinkResult>;

    /**
     * Get a thumbnail for an image. This method currently supports files with
     * the following file extensions: jpg, jpeg, png, tiff, tif, gif and bmp.
     * Photos that are larger than 20MB in size won't be converted to a
     * thumbnail.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ThumbnailError>.
     * @param arg The request parameters.
     */
    public filesGetThumbnail(arg: files.ThumbnailArg): Promise<files.FileMetadata>;

    /**
     * Get thumbnails for a list of images. We allow up to 25 thumbnails in a
     * single batch. This method currently supports files with the following
     * file extensions: jpg, jpeg, png, tiff, tif, gif and bmp. Photos that are
     * larger than 20MB in size won't be converted to a thumbnail.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.GetThumbnailBatchError>.
     * @param arg The request parameters.
     */
    public filesGetThumbnailBatch(arg: files.GetThumbnailBatchArg): Promise<files.GetThumbnailBatchResult>;

    /**
     * Starts returning the contents of a folder. If the result's
     * ListFolderResult.has_more field is true, call listFolderContinue() with
     * the returned ListFolderResult.cursor to retrieve more entries. If you're
     * using ListFolderArg.recursive set to true to keep a local cache of the
     * contents of a Dropbox account, iterate through each entry in order and
     * process them as follows to keep your local state in sync: For each
     * FileMetadata, store the new entry at the given path in your local state.
     * If the required parent folders don't exist yet, create them. If there's
     * already something else at the given path, replace it and remove all its
     * children. For each FolderMetadata, store the new entry at the given path
     * in your local state. If the required parent folders don't exist yet,
     * create them. If there's already something else at the given path, replace
     * it but leave the children as they are. Check the new entry's
     * FolderSharingInfo.read_only and set all its children's read-only statuses
     * to match. For each DeletedMetadata, if your local state has something at
     * the given path, remove it and all its children. If there's nothing at the
     * given path, ignore this entry. Note: auth.RateLimitError may be returned
     * if multiple listFolder() or listFolderContinue() calls with same
     * parameters are made simultaneously by same API app for same user. If your
     * app implements retry logic, please hold off the retry until the previous
     * request finishes.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ListFolderError>.
     * @param arg The request parameters.
     */
    public filesListFolder(arg: files.ListFolderArg): Promise<files.ListFolderResult>;

    /**
     * Once a cursor has been retrieved from listFolder(), use this to paginate
     * through all files and retrieve updates to the folder, following the same
     * rules as documented for listFolder().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ListFolderContinueError>.
     * @param arg The request parameters.
     */
    public filesListFolderContinue(arg: files.ListFolderContinueArg): Promise<files.ListFolderResult>;

    /**
     * A way to quickly get a cursor for the folder's state. Unlike
     * listFolder(), listFolderGetLatestCursor() doesn't return any entries.
     * This endpoint is for app which only needs to know about new files and
     * modifications and doesn't need to know about files that already exist in
     * Dropbox.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ListFolderError>.
     * @param arg The request parameters.
     */
    public filesListFolderGetLatestCursor(arg: files.ListFolderArg): Promise<files.ListFolderGetLatestCursorResult>;

    /**
     * A longpoll endpoint to wait for changes on an account. In conjunction
     * with listFolderContinue(), this call gives you a low-latency way to
     * monitor an account for file changes. The connection will block until
     * there are changes available or a timeout occurs. This endpoint is useful
     * mostly for client-side apps. If you're looking for server-side
     * notifications, check out our [webhooks documentation]{@link
     * https://www.dropbox.com/developers/reference/webhooks}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ListFolderLongpollError>.
     * @param arg The request parameters.
     */
    public filesListFolderLongpoll(arg: files.ListFolderLongpollArg): Promise<files.ListFolderLongpollResult>;

    /**
     * Returns revisions for files based on a file path or a file id. The file
     * path or file id is identified from the latest file entry at the given
     * file path or id. This end point allows your app to query either by file
     * path or file id by setting the mode parameter appropriately. In the
     * ListRevisionsMode.path (default) mode, all revisions at the same file
     * path as the latest file entry are returned. If revisions with the same
     * file id are desired, then mode must be set to ListRevisionsMode.id. The
     * ListRevisionsMode.id mode is useful to retrieve revisions for a given
     * file across moves or renames.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.ListRevisionsError>.
     * @param arg The request parameters.
     */
    public filesListRevisions(arg: files.ListRevisionsArg): Promise<files.ListRevisionsResult>;

    /**
     * Move a file or folder to a different location in the user's Dropbox. If
     * the source path is a folder all its contents will be moved.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.RelocationError>.
     * @param arg The request parameters.
     */
    public filesMoveV2(arg: files.RelocationArg): Promise<files.RelocationResult>;

    /**
     * Move a file or folder to a different location in the user's Dropbox. If
     * the source path is a folder all its contents will be moved.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.RelocationError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesMove(arg: files.RelocationArg): Promise<files.FileMetadataReference|files.FolderMetadataReference|files.DeletedMetadataReference>;

    /**
     * Move multiple files or folders to different locations at once in the
     * user's Dropbox. This route will replace moveBatchV2(). The main
     * difference is this route will return stutus for each entry, while
     * moveBatch() raises failure if any entry fails. This route will either
     * finish synchronously, or return a job ID and do the async move job in
     * background. Please use moveBatchCheckV2() to check the job status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesMoveBatchV2(arg: files.MoveBatchArg): Promise<files.RelocationBatchV2Launch>;

    /**
     * Move multiple files or folders to different locations at once in the
     * user's Dropbox. This route is 'all or nothing', which means if one entry
     * fails, the whole transaction will abort. This route will return job ID
     * immediately and do the async moving job in background. Please use
     * moveBatchCheck() to check the job status.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesMoveBatch(arg: files.RelocationBatchArg): Promise<files.RelocationBatchLaunch>;

    /**
     * Returns the status of an asynchronous job for moveBatchV2(). It returns
     * list of results for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesMoveBatchCheckV2(arg: async.PollArg): Promise<files.RelocationBatchV2JobStatus>;

    /**
     * Returns the status of an asynchronous job for moveBatch(). If success, it
     * returns list of results for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesMoveBatchCheck(arg: async.PollArg): Promise<files.RelocationBatchJobStatus>;

    /**
     * Permanently delete the file or folder at a given path (see
     * https://www.dropbox.com/en/help/40). Note: This endpoint is only
     * available for Dropbox Business apps.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.DeleteError>.
     * @param arg The request parameters.
     */
    public filesPermanentlyDelete(arg: files.DeleteArg): Promise<void>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.AddPropertiesError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesAdd(arg: file_properties.AddPropertiesArg): Promise<void>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.InvalidPropertyGroupError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesOverwrite(arg: file_properties.OverwritePropertyGroupArg): Promise<void>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.RemovePropertiesError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesRemove(arg: file_properties.RemovePropertiesArg): Promise<void>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesTemplateGet(arg: file_properties.GetTemplateArg): Promise<file_properties.GetTemplateResult>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.TemplateError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesTemplateList(arg: void): Promise<file_properties.ListTemplateResult>;

    /**
     * When an error occurs, the route rejects the promise with type
     * Error<file_properties.UpdatePropertiesError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesPropertiesUpdate(arg: file_properties.UpdatePropertiesArg): Promise<void>;

    /**
     * Restore a specific revision of a file to the given path.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.RestoreError>.
     * @param arg The request parameters.
     */
    public filesRestore(arg: files.RestoreArg): Promise<files.FileMetadata>;

    /**
     * Save the data from a specified URL into a file in user's Dropbox. Note
     * that the transfer from the URL must complete within 5 minutes, or the
     * operation will time out and the job will fail. If the given path already
     * exists, the file will be renamed to avoid the conflict (e.g. myfile
     * (1).txt).
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.SaveUrlError>.
     * @param arg The request parameters.
     */
    public filesSaveUrl(arg: files.SaveUrlArg): Promise<files.SaveUrlResult>;

    /**
     * Check the status of a saveUrl() job.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesSaveUrlCheckJobStatus(arg: async.PollArg): Promise<files.SaveUrlJobStatus>;

    /**
     * Searches for files and folders. Note: Recent changes may not immediately
     * be reflected in search results due to a short delay in indexing.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.SearchError>.
     * @param arg The request parameters.
     */
    public filesSearch(arg: files.SearchArg): Promise<files.SearchResult>;

    /**
     * Create a new file with the contents provided in the request. Do not use
     * this to upload a file larger than 150 MB. Instead, create an upload
     * session with uploadSessionStart(). Calls to this endpoint will count as
     * data transport calls for any Dropbox Business teams with a limit on the
     * number of data transport calls allowed per month. For more information,
     * see the [Data transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.UploadError>.
     * @param arg The request parameters.
     */
    public filesUpload(arg: files.CommitInfo): Promise<files.FileMetadata>;

    /**
     * Append more data to an upload session. When the parameter close is set,
     * this call will close the session. A single request should not upload more
     * than 150 MB. The maximum size of a file one can upload to an upload
     * session is 350 GB. Calls to this endpoint will count as data transport
     * calls for any Dropbox Business teams with a limit on the number of data
     * transport calls allowed per month. For more information, see the [Data
     * transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.UploadSessionLookupError>.
     * @param arg The request parameters.
     */
    public filesUploadSessionAppendV2(arg: files.UploadSessionAppendArg): Promise<void>;

    /**
     * Append more data to an upload session. A single request should not upload
     * more than 150 MB. The maximum size of a file one can upload to an upload
     * session is 350 GB. Calls to this endpoint will count as data transport
     * calls for any Dropbox Business teams with a limit on the number of data
     * transport calls allowed per month. For more information, see the [Data
     * transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.UploadSessionLookupError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public filesUploadSessionAppend(arg: files.UploadSessionCursor): Promise<void>;

    /**
     * Finish an upload session and save the uploaded data to the given file
     * path. A single request should not upload more than 150 MB. The maximum
     * size of a file one can upload to an upload session is 350 GB. Calls to
     * this endpoint will count as data transport calls for any Dropbox Business
     * teams with a limit on the number of data transport calls allowed per
     * month. For more information, see the [Data transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<files.UploadSessionFinishError>.
     * @param arg The request parameters.
     */
    public filesUploadSessionFinish(arg: files.UploadSessionFinishArg): Promise<files.FileMetadata>;

    /**
     * This route helps you commit many files at once into a user's Dropbox. Use
     * uploadSessionStart() and uploadSessionAppendV2() to upload file contents.
     * We recommend uploading many files in parallel to increase throughput.
     * Once the file contents have been uploaded, rather than calling
     * uploadSessionFinish(), use this route to finish all your upload sessions
     * in a single request. UploadSessionStartArg.close or
     * UploadSessionAppendArg.close needs to be true for the last
     * uploadSessionStart() or uploadSessionAppendV2() call. The maximum size of
     * a file one can upload to an upload session is 350 GB. This route will
     * return a job_id immediately and do the async commit job in background.
     * Use uploadSessionFinishBatchCheck() to check the job status. For the same
     * account, this route should be executed serially. That means you should
     * not start the next job before current job finishes. We allow up to 1000
     * entries in a single request. Calls to this endpoint will count as data
     * transport calls for any Dropbox Business teams with a limit on the number
     * of data transport calls allowed per month. For more information, see the
     * [Data transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesUploadSessionFinishBatch(arg: files.UploadSessionFinishBatchArg): Promise<files.UploadSessionFinishBatchLaunch>;

    /**
     * Returns the status of an asynchronous job for uploadSessionFinishBatch().
     * If success, it returns list of result for each entry.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public filesUploadSessionFinishBatchCheck(arg: async.PollArg): Promise<files.UploadSessionFinishBatchJobStatus>;

    /**
     * Upload sessions allow you to upload a single file in one or more
     * requests, for example where the size of the file is greater than 150 MB.
     * This call starts a new upload session with the given data. You can then
     * use uploadSessionAppendV2() to add more data and uploadSessionFinish() to
     * save all the data to a file in Dropbox. A single request should not
     * upload more than 150 MB. The maximum size of a file one can upload to an
     * upload session is 350 GB. An upload session can be used for a maximum of
     * 48 hours. Attempting to use an UploadSessionStartResult.session_id with
     * uploadSessionAppendV2() or uploadSessionFinish() more than 48 hours after
     * its creation will return a UploadSessionLookupError.not_found. Calls to
     * this endpoint will count as data transport calls for any Dropbox Business
     * teams with a limit on the number of data transport calls allowed per
     * month. For more information, see the [Data transport limit page]{@link
     * https://www.dropbox.com/developers/reference/data-transport-limit}.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public filesUploadSessionStart(arg: files.UploadSessionStartArg): Promise<files.UploadSessionStartResult>;

    /**
     * Marks the given Paper doc as archived. Note: This action can be performed
     * or undone by anyone with edit permissions to the doc.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsArchive(arg: paper.RefPaperDoc): Promise<void>;

    /**
     * Creates a new Paper doc with the provided content.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.PaperDocCreateError>.
     * @param arg The request parameters.
     */
    public paperDocsCreate(arg: paper.PaperDocCreateArgs): Promise<paper.PaperDocCreateUpdateResult>;

    /**
     * Exports and downloads Paper doc either as HTML or markdown.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsDownload(arg: paper.PaperDocExport): Promise<paper.PaperDocExportResult>;

    /**
     * Lists the users who are explicitly invited to the Paper folder in which
     * the Paper doc is contained. For private folders all users (including
     * owner) shared on the folder are listed and for team folders all non-team
     * users shared on the folder are returned.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsFolderUsersList(arg: paper.ListUsersOnFolderArgs): Promise<paper.ListUsersOnFolderResponse>;

    /**
     * Once a cursor has been retrieved from docsFolderUsersList(), use this to
     * paginate through all users on the Paper folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.ListUsersCursorError>.
     * @param arg The request parameters.
     */
    public paperDocsFolderUsersListContinue(arg: paper.ListUsersOnFolderContinueArgs): Promise<paper.ListUsersOnFolderResponse>;

    /**
     * Retrieves folder information for the given Paper doc. This includes:   -
     * folder sharing policy; permissions for subfolders are set by the
     * top-level folder.   - full 'filepath', i.e. the list of folders (both
     * folderId and folderName) from     the root folder to the folder directly
     * containing the Paper doc.  Note: If the Paper doc is not in any folder
     * (aka unfiled) the response will be empty.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsGetFolderInfo(arg: paper.RefPaperDoc): Promise<paper.FoldersContainingPaperDoc>;

    /**
     * Return the list of all Paper docs according to the argument
     * specifications. To iterate over through the full pagination, pass the
     * cursor to docsListContinue().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public paperDocsList(arg: paper.ListPaperDocsArgs): Promise<paper.ListPaperDocsResponse>;

    /**
     * Once a cursor has been retrieved from docsList(), use this to paginate
     * through all Paper doc.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.ListDocsCursorError>.
     * @param arg The request parameters.
     */
    public paperDocsListContinue(arg: paper.ListPaperDocsContinueArgs): Promise<paper.ListPaperDocsResponse>;

    /**
     * Permanently deletes the given Paper doc. This operation is final as the
     * doc cannot be recovered.  Note: This action can be performed only by the
     * doc owner.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsPermanentlyDelete(arg: paper.RefPaperDoc): Promise<void>;

    /**
     * Gets the default sharing policy for the given Paper doc.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsSharingPolicyGet(arg: paper.RefPaperDoc): Promise<paper.SharingPolicy>;

    /**
     * Sets the default sharing policy for the given Paper doc. The default
     * 'team_sharing_policy' can be changed only by teams, omit this field for
     * personal accounts.  Note: 'public_sharing_policy' cannot be set to the
     * value 'disabled' because this setting can be changed only via the team
     * admin console.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsSharingPolicySet(arg: paper.PaperDocSharingPolicy): Promise<void>;

    /**
     * Updates an existing Paper doc with the provided content.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.PaperDocUpdateError>.
     * @param arg The request parameters.
     */
    public paperDocsUpdate(arg: paper.PaperDocUpdateArgs): Promise<paper.PaperDocCreateUpdateResult>;

    /**
     * Allows an owner or editor to add users to a Paper doc or change their
     * permissions using their email address or Dropbox account ID.  Note: The
     * Doc owner's permissions cannot be changed.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsUsersAdd(arg: paper.AddPaperDocUser): Promise<Array<paper.AddPaperDocUserMemberResult>>;

    /**
     * Lists all users who visited the Paper doc or users with explicit access.
     * This call excludes users who have been removed. The list is sorted by the
     * date of the visit or the share date. The list will include both users,
     * the explicitly shared ones as well as those who came in using the Paper
     * url link.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsUsersList(arg: paper.ListUsersOnPaperDocArgs): Promise<paper.ListUsersOnPaperDocResponse>;

    /**
     * Once a cursor has been retrieved from docsUsersList(), use this to
     * paginate through all users on the Paper doc.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.ListUsersCursorError>.
     * @param arg The request parameters.
     */
    public paperDocsUsersListContinue(arg: paper.ListUsersOnPaperDocContinueArgs): Promise<paper.ListUsersOnPaperDocResponse>;

    /**
     * Allows an owner or editor to remove users from a Paper doc using their
     * email address or Dropbox account ID.  Note: Doc owner cannot be removed.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<paper.DocLookupError>.
     * @param arg The request parameters.
     */
    public paperDocsUsersRemove(arg: paper.RemovePaperDocUser): Promise<void>;

    /**
     * Adds specified members to a file.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.AddFileMemberError>.
     * @param arg The request parameters.
     */
    public sharingAddFileMember(arg: sharing.AddFileMemberArgs): Promise<Array<sharing.FileMemberActionResult>>;

    /**
     * Allows an owner or editor (if the ACL update policy allows) of a shared
     * folder to add another member. For the new member to get access to all the
     * functionality for this folder, you will need to call mountFolder() on
     * their behalf.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.AddFolderMemberError>.
     * @param arg The request parameters.
     */
    public sharingAddFolderMember(arg: sharing.AddFolderMemberArg): Promise<void>;

    /**
     * Identical to update_file_member but with less information returned.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.FileMemberActionError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public sharingChangeFileMemberAccess(arg: sharing.ChangeFileMemberAccessArgs): Promise<sharing.FileMemberActionResult>;

    /**
     * Returns the status of an asynchronous job.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public sharingCheckJobStatus(arg: async.PollArg): Promise<sharing.JobStatus>;

    /**
     * Returns the status of an asynchronous job for sharing a folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public sharingCheckRemoveMemberJobStatus(arg: async.PollArg): Promise<sharing.RemoveMemberJobStatus>;

    /**
     * Returns the status of an asynchronous job for sharing a folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<async.PollError>.
     * @param arg The request parameters.
     */
    public sharingCheckShareJobStatus(arg: async.PollArg): Promise<sharing.ShareFolderJobStatus>;

    /**
     * Create a shared link. If a shared link already exists for the given path,
     * that link is returned. Note that in the returned PathLinkMetadata, the
     * PathLinkMetadata.url field is the shortened URL if
     * CreateSharedLinkArg.short_url argument is set to true. Previously, it was
     * technically possible to break a shared link by moving or renaming the
     * corresponding file or folder. In the future, this will no longer be the
     * case, so your app shouldn't rely on this behavior. Instead, if your app
     * needs to revoke a shared link, use revokeSharedLink().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.CreateSharedLinkError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public sharingCreateSharedLink(arg: sharing.CreateSharedLinkArg): Promise<sharing.PathLinkMetadata>;

    /**
     * Create a shared link with custom settings. If no settings are given then
     * the default visibility is RequestedVisibility.public (The resolved
     * visibility, though, may depend on other aspects such as team and shared
     * folder settings).
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.CreateSharedLinkWithSettingsError>.
     * @param arg The request parameters.
     */
    public sharingCreateSharedLinkWithSettings(arg: sharing.CreateSharedLinkWithSettingsArg): Promise<sharing.FileLinkMetadataReference|sharing.FolderLinkMetadataReference|sharing.SharedLinkMetadataReference>;

    /**
     * Returns shared file metadata.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.GetFileMetadataError>.
     * @param arg The request parameters.
     */
    public sharingGetFileMetadata(arg: sharing.GetFileMetadataArg): Promise<sharing.SharedFileMetadata>;

    /**
     * Returns shared file metadata.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharingUserError>.
     * @param arg The request parameters.
     */
    public sharingGetFileMetadataBatch(arg: sharing.GetFileMetadataBatchArg): Promise<Array<sharing.GetFileMetadataBatchResult>>;

    /**
     * Returns shared folder metadata by its folder ID.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharedFolderAccessError>.
     * @param arg The request parameters.
     */
    public sharingGetFolderMetadata(arg: sharing.GetMetadataArgs): Promise<sharing.SharedFolderMetadata>;

    /**
     * Download the shared link's file from a user's Dropbox.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.GetSharedLinkFileError>.
     * @param arg The request parameters.
     */
    public sharingGetSharedLinkFile(arg: sharing.GetSharedLinkFileArg): Promise<sharing.FileLinkMetadataReference|sharing.FolderLinkMetadataReference|sharing.SharedLinkMetadataReference>;

    /**
     * Get the shared link's metadata.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharedLinkError>.
     * @param arg The request parameters.
     */
    public sharingGetSharedLinkMetadata(arg: sharing.GetSharedLinkMetadataArg): Promise<sharing.FileLinkMetadataReference|sharing.FolderLinkMetadataReference|sharing.SharedLinkMetadataReference>;

    /**
     * Returns a list of LinkMetadata objects for this user, including
     * collection links. If no path is given, returns a list of all shared links
     * for the current user, including collection links, up to a maximum of 1000
     * links. If a non-empty path is given, returns a list of all shared links
     * that allow access to the given path.  Collection links are never returned
     * in this case. Note that the url field in the response is never the
     * shortened URL.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.GetSharedLinksError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public sharingGetSharedLinks(arg: sharing.GetSharedLinksArg): Promise<sharing.GetSharedLinksResult>;

    /**
     * Use to obtain the members who have been invited to a file, both inherited
     * and uninherited members.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFileMembersError>.
     * @param arg The request parameters.
     */
    public sharingListFileMembers(arg: sharing.ListFileMembersArg): Promise<sharing.SharedFileMembers>;

    /**
     * Get members of multiple files at once. The arguments to this route are
     * more limited, and the limit on query result size per file is more strict.
     * To customize the results more, use the individual file endpoint.
     * Inherited users and groups are not included in the result, and
     * permissions are not returned for this endpoint.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharingUserError>.
     * @param arg The request parameters.
     */
    public sharingListFileMembersBatch(arg: sharing.ListFileMembersBatchArg): Promise<Array<sharing.ListFileMembersBatchResult>>;

    /**
     * Once a cursor has been retrieved from listFileMembers() or
     * listFileMembersBatch(), use this to paginate through all shared file
     * members.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFileMembersContinueError>.
     * @param arg The request parameters.
     */
    public sharingListFileMembersContinue(arg: sharing.ListFileMembersContinueArg): Promise<sharing.SharedFileMembers>;

    /**
     * Returns shared folder membership by its folder ID.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharedFolderAccessError>.
     * @param arg The request parameters.
     */
    public sharingListFolderMembers(arg: sharing.ListFolderMembersArgs): Promise<sharing.SharedFolderMembers>;

    /**
     * Once a cursor has been retrieved from listFolderMembers(), use this to
     * paginate through all shared folder members.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFolderMembersContinueError>.
     * @param arg The request parameters.
     */
    public sharingListFolderMembersContinue(arg: sharing.ListFolderMembersContinueArg): Promise<sharing.SharedFolderMembers>;

    /**
     * Return the list of all shared folders the current user has access to.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public sharingListFolders(arg: sharing.ListFoldersArgs): Promise<sharing.ListFoldersResult>;

    /**
     * Once a cursor has been retrieved from listFolders(), use this to paginate
     * through all shared folders. The cursor must come from a previous call to
     * listFolders() or listFoldersContinue().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFoldersContinueError>.
     * @param arg The request parameters.
     */
    public sharingListFoldersContinue(arg: sharing.ListFoldersContinueArg): Promise<sharing.ListFoldersResult>;

    /**
     * Return the list of all shared folders the current user can mount or
     * unmount.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public sharingListMountableFolders(arg: sharing.ListFoldersArgs): Promise<sharing.ListFoldersResult>;

    /**
     * Once a cursor has been retrieved from listMountableFolders(), use this to
     * paginate through all mountable shared folders. The cursor must come from
     * a previous call to listMountableFolders() or
     * listMountableFoldersContinue().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFoldersContinueError>.
     * @param arg The request parameters.
     */
    public sharingListMountableFoldersContinue(arg: sharing.ListFoldersContinueArg): Promise<sharing.ListFoldersResult>;

    /**
     * Returns a list of all files shared with current user.  Does not include
     * files the user has received via shared folders, and does  not include
     * unclaimed invitations.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SharingUserError>.
     * @param arg The request parameters.
     */
    public sharingListReceivedFiles(arg: sharing.ListFilesArg): Promise<sharing.ListFilesResult>;

    /**
     * Get more results with a cursor from listReceivedFiles().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListFilesContinueError>.
     * @param arg The request parameters.
     */
    public sharingListReceivedFilesContinue(arg: sharing.ListFilesContinueArg): Promise<sharing.ListFilesResult>;

    /**
     * List shared links of this user. If no path is given, returns a list of
     * all shared links for the current user. If a non-empty path is given,
     * returns a list of all shared links that allow access to the given path -
     * direct links to the given path and links to parent folders of the given
     * path. Links to parent folders can be suppressed by setting direct_only to
     * true.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ListSharedLinksError>.
     * @param arg The request parameters.
     */
    public sharingListSharedLinks(arg: sharing.ListSharedLinksArg): Promise<sharing.ListSharedLinksResult>;

    /**
     * Modify the shared link's settings. If the requested visibility conflict
     * with the shared links policy of the team or the shared folder (in case
     * the linked file is part of a shared folder) then the
     * LinkPermissions.resolved_visibility of the returned SharedLinkMetadata
     * will reflect the actual visibility of the shared link and the
     * LinkPermissions.requested_visibility will reflect the requested
     * visibility.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ModifySharedLinkSettingsError>.
     * @param arg The request parameters.
     */
    public sharingModifySharedLinkSettings(arg: sharing.ModifySharedLinkSettingsArgs): Promise<sharing.FileLinkMetadataReference|sharing.FolderLinkMetadataReference|sharing.SharedLinkMetadataReference>;

    /**
     * The current user mounts the designated folder. Mount a shared folder for
     * a user after they have been added as a member. Once mounted, the shared
     * folder will appear in their Dropbox.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.MountFolderError>.
     * @param arg The request parameters.
     */
    public sharingMountFolder(arg: sharing.MountFolderArg): Promise<sharing.SharedFolderMetadata>;

    /**
     * The current user relinquishes their membership in the designated file.
     * Note that the current user may still have inherited access to this file
     * through the parent folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RelinquishFileMembershipError>.
     * @param arg The request parameters.
     */
    public sharingRelinquishFileMembership(arg: sharing.RelinquishFileMembershipArg): Promise<void>;

    /**
     * The current user relinquishes their membership in the designated shared
     * folder and will no longer have access to the folder.  A folder owner
     * cannot relinquish membership in their own folder. This will run
     * synchronously if leave_a_copy is false, and asynchronously if
     * leave_a_copy is true.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RelinquishFolderMembershipError>.
     * @param arg The request parameters.
     */
    public sharingRelinquishFolderMembership(arg: sharing.RelinquishFolderMembershipArg): Promise<async.LaunchEmptyResult>;

    /**
     * Identical to remove_file_member_2 but with less information returned.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RemoveFileMemberError>.
     * @deprecated
     * @param arg The request parameters.
     */
    public sharingRemoveFileMember(arg: sharing.RemoveFileMemberArg): Promise<sharing.FileMemberActionIndividualResult>;

    /**
     * Removes a specified member from the file.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RemoveFileMemberError>.
     * @param arg The request parameters.
     */
    public sharingRemoveFileMember2(arg: sharing.RemoveFileMemberArg): Promise<sharing.FileMemberRemoveActionResult>;

    /**
     * Allows an owner or editor (if the ACL update policy allows) of a shared
     * folder to remove another member.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RemoveFolderMemberError>.
     * @param arg The request parameters.
     */
    public sharingRemoveFolderMember(arg: sharing.RemoveFolderMemberArg): Promise<async.LaunchResultBase>;

    /**
     * Revoke a shared link. Note that even after revoking a shared link to a
     * file, the file may be accessible if there are shared links leading to any
     * of the file parent folders. To list all shared links that enable access
     * to a specific file, you can use the listSharedLinks() with the file as
     * the ListSharedLinksArg.path argument.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.RevokeSharedLinkError>.
     * @param arg The request parameters.
     */
    public sharingRevokeSharedLink(arg: sharing.RevokeSharedLinkArg): Promise<void>;

    /**
     * Change the inheritance policy of an existing Shared Folder. Only
     * permitted for shared folders in a shared team root. If a
     * ShareFolderLaunch.async_job_id is returned, you'll need to call
     * checkShareJobStatus() until the action completes to get the metadata for
     * the folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.SetAccessInheritanceError>.
     * @param arg The request parameters.
     */
    public sharingSetAccessInheritance(arg: sharing.SetAccessInheritanceArg): Promise<sharing.ShareFolderLaunch>;

    /**
     * Share a folder with collaborators. Most sharing will be completed
     * synchronously. Large folders will be completed asynchronously. To make
     * testing the async case repeatable, set `ShareFolderArg.force_async`. If a
     * ShareFolderLaunch.async_job_id is returned, you'll need to call
     * checkShareJobStatus() until the action completes to get the metadata for
     * the folder.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.ShareFolderError>.
     * @param arg The request parameters.
     */
    public sharingShareFolder(arg: sharing.ShareFolderArg): Promise<sharing.ShareFolderLaunch>;

    /**
     * Transfer ownership of a shared folder to a member of the shared folder.
     * User must have AccessLevel.owner access to the shared folder to perform a
     * transfer.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.TransferFolderError>.
     * @param arg The request parameters.
     */
    public sharingTransferFolder(arg: sharing.TransferFolderArg): Promise<void>;

    /**
     * The current user unmounts the designated folder. They can re-mount the
     * folder at a later time using mountFolder().
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.UnmountFolderError>.
     * @param arg The request parameters.
     */
    public sharingUnmountFolder(arg: sharing.UnmountFolderArg): Promise<void>;

    /**
     * Remove all members from this file. Does not remove inherited members.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.UnshareFileError>.
     * @param arg The request parameters.
     */
    public sharingUnshareFile(arg: sharing.UnshareFileArg): Promise<void>;

    /**
     * Allows a shared folder owner to unshare the folder. You'll need to call
     * checkJobStatus() to determine if the action has completed successfully.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.UnshareFolderError>.
     * @param arg The request parameters.
     */
    public sharingUnshareFolder(arg: sharing.UnshareFolderArg): Promise<async.LaunchEmptyResult>;

    /**
     * Changes a member's access on a shared file.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.FileMemberActionError>.
     * @param arg The request parameters.
     */
    public sharingUpdateFileMember(arg: sharing.UpdateFileMemberArgs): Promise<sharing.MemberAccessLevelResult>;

    /**
     * Allows an owner or editor of a shared folder to update another member's
     * permissions.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.UpdateFolderMemberError>.
     * @param arg The request parameters.
     */
    public sharingUpdateFolderMember(arg: sharing.UpdateFolderMemberArg): Promise<sharing.MemberAccessLevelResult>;

    /**
     * Update the sharing policies for a shared folder. User must have
     * AccessLevel.owner access to the shared folder to update its policies.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<sharing.UpdateFolderPolicyError>.
     * @param arg The request parameters.
     */
    public sharingUpdateFolderPolicy(arg: sharing.UpdateFolderPolicyArg): Promise<sharing.SharedFolderMetadata>;

    /**
     * Retrieves team events. Events have a lifespan of two years. Events older
     * than two years will not be returned. Many attributes note 'may be missing
     * due to historical data gap'. Note that the file_operations category and &
     * analogous paper events are not available on all Dropbox Business
     * [plans]{@link /business/plans-comparison}. Use
     * [features/get_values]{@link
     * /developers/documentation/http/teams#team-features-get_values} to check
     * for this feature. Permission : Team Auditing.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<team_log.GetTeamEventsError>.
     * @param arg The request parameters.
     */
    public teamLogGetEvents(arg: team_log.GetTeamEventsArg): Promise<team_log.GetTeamEventsResult>;

    /**
     * Once a cursor has been retrieved from getEvents(), use this to paginate
     * through all events. Permission : Team Auditing.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<team_log.GetTeamEventsContinueError>.
     * @param arg The request parameters.
     */
    public teamLogGetEventsContinue(arg: team_log.GetTeamEventsContinueArg): Promise<team_log.GetTeamEventsResult>;

    /**
     * Get information about a user's account.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<users.GetAccountError>.
     * @param arg The request parameters.
     */
    public usersGetAccount(arg: users.GetAccountArg): Promise<users.BasicAccount>;

    /**
     * Get information about multiple user accounts.  At most 300 accounts may
     * be queried per request.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<users.GetAccountBatchError>.
     * @param arg The request parameters.
     */
    public usersGetAccountBatch(arg: users.GetAccountBatchArg): Promise<users.GetAccountBatchResult>;

    /**
     * Get information about the current user's account.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public usersGetCurrentAccount(arg: void): Promise<users.FullAccount>;

    /**
     * Get the space usage information for the current user's account.
     *
     * When an error occurs, the route rejects the promise with type
     * Error<void>.
     * @param arg The request parameters.
     */
    public usersGetSpaceUsage(arg: void): Promise<users.SpaceUsage>;
  }
}
