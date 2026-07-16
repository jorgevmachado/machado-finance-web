import { isObject ,isObjectEmpty } from './object';

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

  describe('isObject', () => {
    it('should return true when param is a object', () => {
      expect(isObject(mockList[0])).toBeTruthy();
    });

    it('should return false when param is not a valid object', () => {
      expect(isObject('not-object')).toBeFalsy();
    });
  });
});