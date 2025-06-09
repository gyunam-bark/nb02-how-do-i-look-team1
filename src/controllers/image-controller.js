import path from 'path';
import fs from 'fs';
import ImageUploadService from '../services/image-service.js';
import uploadsDir from '../config/uploads-path.js';

class ImageUploadController {
  constructor() {
    this.imageService = new ImageUploadService();
  }

  async uploadImage(req, res, next) {
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
      }

      const { originalname, path: tempPath } = file;

      // 원래 이름과 확장자 분리
      const ext = path.extname(originalname);
      const baseName = path.basename(originalname, ext);

      // 공백, 특수문자 제거 (파일 이름으로 안전하게 만들기)
      const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');

      // 중복 방지위해 timestamp 추가
      const timestamp = Date.now();
      const newFileName = `${safeBaseName}+${timestamp}${ext}`;
      const newPath = path.join(uploadsDir, newFileName);

      // 파일 이동
      fs.renameSync(tempPath, newPath);

      const imageUrl = `images/upload/${newFileName}`;

      // DB 저장
      const uploaded = await this.imageService.createImage({
        imageUrl,
      });
      console.log('🫠 uploaded:', uploaded);

      return res.status(201).json({ message: 'Successfully Image uploaded', uploaded });
    } catch (error) {
      next(`controllerError:`, error);
    }
  }
}

export default ImageUploadController;
