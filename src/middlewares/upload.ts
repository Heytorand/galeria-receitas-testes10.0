import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unico = Date.now() + "-" + Math.round(Math.random() * 1000);
    cb(null, unico + path.extname(file.originalname));
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  const permitidos = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (permitidos.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Tipo nao permitido. Envie JPG, PNG, GIF ou WebP."), false);
};

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });
