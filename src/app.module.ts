import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import {ServeStaticModule} from "@nestjs/serve-static";
import * as path from 'path';

@Module({
  imports: [MulterModule.register({
    storage: diskStorage({
      destination: './video', // Папка для сохранения загруженных файлов
      filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const extension = file.originalname.split('.').pop(); // Получение расширения загружаемого файла
        cb(null, `${file.fieldname}-${uniqueSuffix}.${extension}`);
      },
    }),
  }),
  ServeStaticModule.forRoot({
    rootPath:path.resolve(__dirname, '..','video')
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
