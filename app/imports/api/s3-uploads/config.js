export default {
    AWS: Meteor.settings.private && Meteor.settings.private.AWS,
    AWS_URL: Meteor.settings.public.AWS.url,
    mimeTypes: {
        "html": "text/html",
        "jpeg": "image/jpeg",
        "jpg": "image/jpeg",
        "png": "image/png",
        "gif": "image/gif",
        "js": "text/javascript",
        "css": "text/css",
        "pdf": "application/pdf",
        "doc": "application/msword",
        "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "zip": "application/zip, application/x-compressed-zip",
        "txt": "text/plain"
    },
    thumbs: [256]
}