export const webhook = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;
    console.log({ body });

    const ls = await Livestream.findOne({ streamId: body.stream?.id });

    if (body.event === "stream.started") {
      if (ls) return next(new AppError("Stream already present", 400));
      const newLivestream = new Livestream({
        streamId: body.stream?.id,
        name: body.stream?.name,
      });
      await newLivestream.save();
      return successResponse(res, { msg: "Stream started successfully" });
    }

    if (!ls) return next(new AppError("This should not happen", 400));
    if (ls.cid) return next(new AppError("Recording already pinned", 400));

    if (!body?.payload?.mp4Url)
      return next(new AppError("No recording uri", 404));

    const url = body.payload.mp4Url;
    const { data } = await axios.get(url, {
      responseType: "stream",
    });

    const options: PinataPinOptions = {
      pinataMetadata: {
        name: body.stream?.id,
        // @ts-ignore
        keyvalues: {
          id: body.stream?.id,
          url,
        },
      },
    };

    const pinFile = await pinata.pinFileToIPFS(data, options);

    await Livestream.updateOne(
      { streamId: body.stream.id },
      {
        recodingUrl: url,
        cid: pinFile.IpfsHash,
        size: pinFile.PinSize,
      }
    );

    return successResponse(res, { msg: "Success" });
  }
);
