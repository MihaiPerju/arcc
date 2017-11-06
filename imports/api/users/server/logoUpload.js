import {createRoute} from '/imports/api/s3-uploads/server/router';

createRoute('/uploads/logo/:token', ({user, error, filenames, success, upload}) => {
    if (!user) {
        return error('Not Authorized');
    }

    if (filenames.length != 1) {
        return error('Invalid number of files');
    }
    const [uploadId] = upload();

    success(uploadId);
});