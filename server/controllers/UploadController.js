exports.uploadImage = (req, res, next) => {
    try {
        console.log(req);
        return res.status(201).json({ 
            success: true, 
            image: req.file.path, 
            fileName: req.file.filename 
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
}