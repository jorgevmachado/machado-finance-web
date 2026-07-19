import { createActionMessages } from '@/app/shared/messages/messages';

describe('Messages', () => {
  describe('createActionMessages', () => {
    it('should return the correct message key for create success', () => {
      const key = 'category';
      const type = 'create';
      const status = 'success';
      const expectedMessage = 'category.messages.success.create';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for update success', () => {
      const key = 'category';
      const type = 'update';
      const status = 'success';
      const expectedMessage = 'category.messages.success.update';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for delete success', () => {
      const key = 'category';
      const type = 'delete';
      const status = 'success';
      const expectedMessage = 'category.messages.success.delete';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });

    it('should return the correct message key for create error', () => {
      const key = 'category';
      const type = 'create';
      const status = 'error';
      const expectedMessage = 'category.messages.error.create';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for update error', () => {
      const key = 'category';
      const type = 'update';
      const status = 'error';
      const expectedMessage = 'category.messages.error.update';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for delete error', () => {
      const key = 'category';
      const type = 'delete';
      const status = 'error';
      const expectedMessage = 'category.messages.error.delete';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });

  });
});