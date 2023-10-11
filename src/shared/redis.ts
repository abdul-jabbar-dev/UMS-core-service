import { SetOptions, createClient } from 'redis';

import config from '../config';

const client = createClient({
  url: config.redis.url,
});
const pubClient = createClient({
  url: config.redis.url,
});
const subClient = createClient({
  url: config.redis.url,
});

client.on('error', err => {
  console.log('Redis error: ', err);
});

client.on('connect', () => {
  console.log('⚓ Redis Connected!');
});

const connect = async (): Promise<void> => {
  await client.connect();
  await subClient.connect();
  await pubClient.connect();
};

const set = async (key: string, data: string, options: SetOptions) => {
  await client.set(key, data, options);
};

const get = async (key: string): Promise<string | null> => {
  return await client.get(key);
};

const del = async (key: string): Promise<void> => {
  await client.del(key);
};
const setAccessToken = async (userId: string, token: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await client.set(key, token, {
    EX: Number(config.redis.redisTokenExpiresIn),
  });
};
const getAccessToken = async (userId: string): Promise<string | null> => {
  const key = `access-token:${userId}`;
  return await client.get(key);
};
const delAccessToken = async (userId: string): Promise<void> => {
  const key = `access-token:${userId}`;
  await client.del(key);
};
const disconnect = async (): Promise<void> => {
  await client.quit();
  await subClient.quit();
  await pubClient.quit();
};

const REDIS = {
  delAccessToken,
  getAccessToken,
  setAccessToken,
  disconnect,
  del,
  get,
  set,
  connect,
  subClient,
  pubClient,
  publish: pubClient.publish.bind(pubClient),
  subscribe: subClient.subscribe.bind(subClient),
};
export default REDIS;
