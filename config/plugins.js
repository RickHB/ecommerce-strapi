module.exports = ({ env }) => ({

    upload: {
      config: {
        provider: 'aws-s3',
        providerOptions: {
          accessKeyId: env('AWS_ACCESS_KEY_ID'),
          secretAccessKey: env('AWS_SECRET_ACCESS_KEY'), 
          region: 'us-east-2',
          params: {
            Bucket: env('AWS_BUCKET')
          }
          
        }
      }
    }
  });