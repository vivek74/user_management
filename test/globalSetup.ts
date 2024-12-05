export = async function globalSetup() {
  // App
  process.env.APP_ENV = 'testing';
  process.env.APP_PORT = '9001';

  // Cloudinary
  process.env.CLOUDINARY_CLOUD_NAME = 'drcgparug';
  process.env.CLOUDINARY_API_KEY = '452257291938476';
  process.env.CLOUDINARY_API_SECRET = 'S69wmH0I84sYzUpefH5Y8Us58S8';

  // JWT
  process.env.JWT_SECRET =
    'c192ac41d0fecb80de8d0b50b0a8f642c15beed29a5211a6e22a032b93738071';
  process.env.JWT_ACCESS_SECRET =
    '79a0c614f0b5866aafce80439757c8e8720a997ba78df0625d6c960a3fa85ce5';
  process.env.JWT_REFRESH_SECRET =
    'e1cbbe44e264152ada6997c1075c788c506fc855b9acd2c0bbd2db50c5d77967';
  process.env.JWT_ACCESS_TOKEN_EXPIRES_IN = '30m';
  process.env.JWT_REFRESH_TOKEN_EXPIRES_IN = '7d';
  process.env.JWT_EXPIRES_IN = '1h';

  // DB
  process.env.TYPE = 'postgres';
  process.env.HOST = 'localhost';
  process.env.PORT = '5433';
  process.env.USERNAME = 'test';
  process.env.PASSWORD = 'test123';
  process.env.DATABASE = 'test_db';
};
