const AddThreadComment = require('../AddThreadComment');

describe('AddThreadComment Entities', () => {
  it('should throw error when payload does not contain needed property', () => {
    const payload = {
      content: 'abc',
      threadId: 'thread-123',
    };

    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    const payload = {
      content: true,
      userId: 123,
      threadId: 123,
    };

    expect(() => new AddThreadComment(payload)).toThrowError('ADD_THREAD_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create addThreadComment object correctly', () => {
    const payload = {
      content: 'dicoding',
      userId: 'user-123',
      threadId: 'thread-123',
    };

    const { content, userId, threadId } = new AddThreadComment(payload);

    expect(content).toEqual(payload.content);
    expect(userId).toEqual(payload.userId);
    expect(threadId).toEqual(payload.threadId);
  });
});
