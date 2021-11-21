export const uploadRecodingIpfs = catchAsync(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { url, fileName, roomId, requestOrigin } = req.body;

    const { data } = await axios.get(url, {
      responseType: "stream",
    });

    const options: PinataPinOptions = {
      pinataMetadata: {
        name: fileName,
        // @ts-ignore
        keyvalues: {
          roomId,
          requestOrigin,
        },
      },
    };

    const pinFile = await pinata.pinFileToIPFS(data, options);

    const newRecording = new Recording({
      name: fileName,
      roomId,
      requestOrigin,
      s3Url: url,
      cid: pinFile.IpfsHash,
      size: pinFile.PinSize,
    });
    await newRecording.save();

    return successResponse(res, newRecording);
  }
);
