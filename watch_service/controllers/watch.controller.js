import path from 'path'; // Still useful if you need path manipulation for videoKey, though not strictly for this version.


// Your modified watchVideo controller for public CloudFront content
const watchVideo = async (req, res) => {
    try {
        // Ensure CLOUDFRONT_DOMAIN is available.
        if (!process.env.CLOUDFRONT_DOMAIN) {
            throw new Error("CLOUDFRONT_DOMAIN environment variable is not set. Cannot construct public URL.");
        }

        const videoKey = req.query.key; 
        console.log('Requested video key for CloudFront:', videoKey);

        const cloudFrontUrl = `https://${process.env.CLOUDFRONT_DOMAIN}/${videoKey}`;
        
        console.log('Constructed Public CloudFront URL:', cloudFrontUrl);

        // Send the direct CloudFront URL to the client.
        res.json({ videoUrl: cloudFrontUrl }); 

    } catch (err) {
        console.error('Error in watchVideo constructing CloudFront URL:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};

export default watchVideo;