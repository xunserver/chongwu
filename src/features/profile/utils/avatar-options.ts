/**
 * Avatar Options
 *
 * 预设头像配置
 * 注意：实际项目中需要将头像图片放到 public/avatars/ 目录下
 */

import type { AvatarOption } from '../types/profile'

export const avatarOptions: AvatarOption[] = [
  // 猫咪头像
  {
    id: 'avatar-1',
    name: '橘猫',
    url: '/avatars/cat-orange.svg',
    category: 'cat',
  },
  {
    id: 'avatar-2',
    name: '黑猫',
    url: '/avatars/cat-black.svg',
    category: 'cat',
  },
  {
    id: 'avatar-3',
    name: '白猫',
    url: '/avatars/cat-white.svg',
    category: 'cat',
  },
  {
    id: 'avatar-4',
    name: '花猫',
    url: '/avatars/cat-calico.svg',
    category: 'cat',
  },
  {
    id: 'avatar-5',
    name: '灰猫',
    url: '/avatars/cat-grey.svg',
    category: 'cat',
  },

  // 狗狗头像
  {
    id: 'avatar-6',
    name: '金毛',
    url: '/avatars/dog-golden.svg',
    category: 'dog',
  },
  {
    id: 'avatar-7',
    name: '柯基',
    url: '/avatars/dog-corgi.svg',
    category: 'dog',
  },
  {
    id: 'avatar-8',
    name: '哈士奇',
    url: '/avatars/dog-husky.svg',
    category: 'dog',
  },
  {
    id: 'avatar-9',
    name: '泰迪',
    url: '/avatars/dog-poodle.svg',
    category: 'dog',
  },
  {
    id: 'avatar-10',
    name: '柴犬',
    url: '/avatars/dog-shiba.svg',
    category: 'dog',
  },

  // 其他宠物头像
  {
    id: 'avatar-11',
    name: '兔子',
    url: '/avatars/rabbit.svg',
    category: 'other',
  },
  {
    id: 'avatar-12',
    name: '仓鼠',
    url: '/avatars/hamster.svg',
    category: 'other',
  },
  {
    id: 'avatar-13',
    name: '鸟',
    url: '/avatars/bird.svg',
    category: 'other',
  },
  {
    id: 'avatar-14',
    name: '鱼',
    url: '/avatars/fish.svg',
    category: 'other',
  },
  {
    id: 'avatar-15',
    name: '乌龟',
    url: '/avatars/turtle.svg',
    category: 'other',
  },
]

export const defaultAvatar = avatarOptions[0].id
