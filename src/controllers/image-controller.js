import path from 'path';
import fs from 'fs';
import ImageUploadService from '../services/image-service.js';
import bucket from '../config/firebase-admin.js';

class ImageUploadController {
  constructor() {
    this.imageService = new ImageUploadService();
  }

  async uploadImage(req, res, next) {
    // console.log('FILES:', req.files);
    try {
      const file = req.file;

      if (!file) {
        return res.status(400).json({ error: '이미지 파일이 필요합니다.' });
      }

      // const uploadedImages = [];

      // for (const file of files) {
      //   const { originalname, path: tempPath, mimetype } = file;

      //   // 원래 이름과 확장자 분리
      //   const ext = path.extname(originalname);
      //   const baseName = path.basename(originalname, ext);

      //   // 공백, 특수문자 제거 (파일 이름으로 안전하게 만들기)
      //   const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');

      //   // 중복 방지위해 timestamp 추가
      //   const timestamp = Date.now();
      //   const firebaseFileName = `${safeBaseName}_${timestamp}${ext}`;
      //   const destination = `images/${firebaseFileName}`; // Firebase 내 경로

      //   // Firebase에 업로드
      //   await bucket.upload(tempPath, {
      //     destination,
      //     metadata: {
      //       contentType: file.mimetype,
      //     },
      //   });

      //   // 임시 파일 삭제
      //   fs.unlinkSync(tempPath);

      //   // 공개 URL 생성
      //   const fileRef = bucket.file(destination);
      //   const [url] = await fileRef.getSignedUrl({
      //     action: 'read',
      //     expires: '03-01-2500',
      //   });

      //   // DB 저장
      //   const uploaded = await this.imageService.createImage({
      //     imageUrl: url,
      //   });

      //   uploadedImages.push(uploaded.imageUrl);
      // }

      // 각 파일마다 하나의 응답을 return 하도록 수정

      const { originalname, path: tempPath, mimetype } = file;
      const ext = path.extname(originalname);
      const baseName = path.basename(originalname, ext);
      const safeBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const firebaseFileName = `${safeBaseName}_${timestamp}${ext}`;
      const destination = `images/${firebaseFileName}`;

      await bucket.upload(tempPath, {
        destination,
        metadata: { contentType: mimetype },
      });

      fs.unlinkSync(tempPath);

      const fileRef = bucket.file(destination);
      const [url] = await fileRef.getSignedUrl({
        action: 'read',
        expires: '03-01-2500',
      });

      const uploaded = await this.imageService.createImage({ imageUrl: url });

      // ✅ 프론트 명세에 맞게 string으로 단일 응답
      return res.status(200).json({ imageUrl: uploaded.imageUrl });
    } catch (error) {
      next(error);
    }
  }
}

export default ImageUploadController;
