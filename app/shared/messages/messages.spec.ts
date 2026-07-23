import { createActionMessages } from './messages';

describe('Messages', () => {
  describe('createActionMessages', () => {
    it('should return the correct message key for create success', () => {
      const key = 'category';
      const type = 'create';
      const status = 'success';
      const expectedMessage = 'category.message.success.create';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for update success', () => {
      const key = 'category';
      const type = 'update';
      const status = 'success';
      const expectedMessage = 'category.message.success.update';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for delete success', () => {
      const key = 'category';
      const type = 'delete';
      const status = 'success';
      const expectedMessage = 'category.message.success.delete';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });

    it('should return the correct message key for create error', () => {
      const key = 'category';
      const type = 'create';
      const status = 'error';
      const expectedMessage = 'category.message.error.create';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for update error', () => {
      const key = 'category';
      const type = 'update';
      const status = 'error';
      const expectedMessage = 'category.message.error.update';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });
    it('should return the correct message key for delete error', () => {
      const key = 'category';
      const type = 'delete';
      const status = 'error';
      const expectedMessage = 'category.message.error.delete';

      const result = createActionMessages(key, type, status);

      expect(result).toBe(expectedMessage);
    });

  });
});