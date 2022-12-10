const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const ThreadTableTestHelper = require('../../../../tests/ThreadTableTestHelper');
const ThreadCommentsTableTestHelper = require('../../../../tests/ThreadCommentsTableTestHelper');

const AddThread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const AddThreadComment = require('../../../Domains/threads/entities/AddThreadComment');

describe('ThreadRepositoryPostgres', () => {
  beforeAll(async () => {
    await UsersTableTestHelper.addUser({ username: 'dicoding' });
  });
  afterEach(async () => {
    await ThreadTableTestHelper.cleanTable();
    await ThreadCommentsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await ThreadCommentsTableTestHelper.cleanTable();
    await ThreadTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist add thread and return recorded thread correctly', async () => {
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      const addThread = new AddThread({
        title: 'dicoding',
        body: 'dicoding indonesia',
        userId: userId[0].id,
      });

      const fakeIdGenerator = () => 123;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThread(addThread);

      const threads = await ThreadTableTestHelper.findThreadById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('addThreadComment function', () => {
    it('should persist add thread and return recorded thread comment correctly', async () => {
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      await ThreadTableTestHelper.addThread({ userId: userId[0].id });
      const threadId = await ThreadTableTestHelper.findThreadById('thread-123');
      const addThreadComment = new AddThreadComment({
        content: 'dicoding',
        threadId: threadId[0].id,
        userId: userId[0].id,
      });
      const fakeIdGenerator = () => 123;

      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      await threadRepositoryPostgres.addThreadComment(addThreadComment);

      const threadComments = await ThreadCommentsTableTestHelper.findThreadCommentById('comment-123');
      expect(threadComments).toHaveLength(1);
      expect(threadComments[0].content).toEqual(addThreadComment.content);
      expect(threadComments[0].user_id).toEqual(addThreadComment.userId);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      const userId = await UsersTableTestHelper.findUsersById('user-123');
      await ThreadTableTestHelper.addThread({ userId: userId[0].id });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.getThreadById('thread-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('deleteThreadCommentById function', () => {
    it('should persist delete thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      await UsersTableTestHelper.addUser({
        id: 'user-124',
        username: 'dicoding 123',
      });
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.getThreadCommentById('comment-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('deleteThreadCommentById function', () => {
    it('should persist delete thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.deleteThreadCommentById('comment-123');
      expect(data.rowCount).toEqual(1);
    });
  });

  describe('getThreadCommentsByThreadId', () => {
    it('should persist comment thread correctly', async () => {
      const user = await UsersTableTestHelper.findUsersById('user-123');
      const secondUser = await UsersTableTestHelper.findUsersById('user-124');
      await ThreadTableTestHelper.addThread({ userId: user[0].id });
      await ThreadCommentsTableTestHelper.addThreadComment({ id: 'comment-123', userId: secondUser[0].id, threadId: 'thread-123' });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});
      const data = await threadRepositoryPostgres.getThreadCommentsByThreadId('thread-123');
      expect(data.rowCount).toEqual(1);
    });
  });
});
