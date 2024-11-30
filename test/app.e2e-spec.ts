import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('E2E Tests', () => {
  let app: INestApplication;
  let tokenX: string;
  let tokenY: string;
  let articleId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  // اختبار تسجيل مستخدم ضيف جديد

  // اختبار تسجيل دخول مستخدم ضيف باستخدام بيانات صحيحة
  it('A guest user should log in successfully with correct credentials', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: 'testuser', password: 'password123' });

    console.log('Response Body:', response.body); // طباعة تفاصيل الاستجابة

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('access_token');
    tokenX = response.body.access_token;
  });

  // اختبار فشل تسجيل الدخول عند إدخال بيانات غير صحيحة
  it('Login should fail if credentials are incorrect', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'guest@example.com', password: 'wrongpassword' });
    expect(response.status).toBe(401);
  });

  // اختبار قدرة مستخدم ضيف على استكشاف المقالات
  it('A guest user should be able to explore articles', async () => {
    const response = await request(app.getHttpServer()).get(
      '/posts?page=1&pageSize=10',
    );
    console.log('Response Body:', response.body); // طباعة تفاصيل الاستجابة

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Object);
  });

  // اختبار منع مستخدم ضيف من إنشاء مقال جديد
  it('A guest user should not be allowed to create an article', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .send({ title: 'New Article', body: 'Content' });
    expect(response.status).toBe(401);
  });

  // اختبار إمكانية مستخدم مسجل لإنشاء مقال جديد
  it('A logged-in user should be able to create a post', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${tokenX}`)
      .send({ title: 'User X Article', body: 'Content' });

    expect(response.status).toBe(201);
    articleId = response.body.id;
    console.log(articleId); // طباعة رقم المقال
  });

  // اختبار فشل إنشاء مقال بدون محتوى
  it('Creating an article should fail if the body is empty', async () => {
    const response = await request(app.getHttpServer())
      .post('/posts')
      .set('Authorization', `Bearer ${tokenX}`)
      .send({});

    expect(response.status).toBe(500);
  });

 
});
