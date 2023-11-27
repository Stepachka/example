import { Controller, Get, HttpCode, HttpException, HttpStatus, Param, Post, Request, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';
import { join } from 'path';
import * as fs from "fs";

@Controller('files')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file.filename
}
// стандартный поток
// @Get('stream-file')
// getFile(): StreamableFile {
//   const file = createReadStream(join(process.cwd(), 'video/file-1701044665308-615720800.webm'));
//   return new StreamableFile(file)
// }

@Get('stream-file/:filename')
async getStreamVideo(@Res() res, @Request() req, @Param('filename') filename: string) {
  const range = req.headers.range;

  if (!range) {
    return new HttpException("not range in request", HttpStatus.BAD_REQUEST)
  }

  const videoName = `video/${filename}`
  console.log(videoName)
  const fileSize = fs.statSync(join(process.cwd(), `video/${filename}`)).size;
  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ""))
  const end = Math.min(start + CHUNK_SIZE, fileSize - 1);
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type":"video/webm"
  }

  res.writeHead(206, headers);
  const fileStream = createReadStream(join(process.cwd(), videoName), {start, end});
  fileStream.pipe(res)


}
}
