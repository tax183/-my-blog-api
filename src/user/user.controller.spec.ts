import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const mockUserService = {
      findOne: jest.fn(), // محاكاة لدالة findOne
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService, // استبدال UserService بالمحاكاة
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by ID', async () => {
      const mockUserId = 1; // ID المستخدم للاختبار
      const mockUser: Partial<User> = {
        id: mockUserId,
        username: 'testuser',
        
        role: 'user',
      };

      // محاكاة استجابة دالة findOne
      (service.findOne as jest.Mock).mockResolvedValue(mockUser);

      // استدعاء الدالة findOne في الكنترولر
      const result = await controller.findOne(mockUserId.toString());

      // التحقق من النتيجة المرجعة
      expect(result).toEqual({
        message: `User with ID ${mockUserId} retrieved successfully`,
        data: expect.objectContaining({
          id: mockUserId,
          username: 'testuser',
        }),
      });

      // التحقق من استدعاء الخدمة بالقيمة الصحيحة
      expect(service.findOne).toHaveBeenCalledWith(mockUserId);
    });

    it('should throw an error if user not found', async () => {
      const mockUserId = 999; // ID غير موجود

      // محاكاة استجابة الدالة لترجع خطأ
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne(mockUserId.toString())).rejects.toThrow(
        `User with ID ${mockUserId} not found`,
      );

      expect(service.findOne).toHaveBeenCalledWith(mockUserId);
    });
  });
});
