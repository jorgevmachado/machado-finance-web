import { isObjectEmpty } from '@/app/utils/object/object';

describe('Object', () => {
  const mockList = [
    { id: '1', name: 'John Doe', name_code: 'john_doe' },
    { id: '2', name: 'Jane Smith', name_code: 'jane_smith' },
    { id: '3', name: 'Alice Johnson', name_code: 'alice_johnson' },
  ];
  beforeEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();
  });

  afterEach(() => {
    jest.resetModules();
  });

  describe('isObjectEmpty', () => {
    it('should return true when object is empty', () => {
      expect(isObjectEmpty({})).toBeTruthy();
    });

    it('should return false when object is not empty', () => {
      expect(isObjectEmpty(mockList[0])).toBeFalsy();
    });

    it('should return false when value is not object.', () => {
      expect(isObjectEmpty(0)).toBeFalsy();
    });
  });
});