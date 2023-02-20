import axios from 'axios';

// profile img 출력하기
export const getProfileImg = async () => {
  return await axios.get('http://localhost:4001/users');
};

// profile img 수정하기
export const updateProfileImg = async (item: any) => {
  return await axios.patch(`http://localhost:4001/users/${item.id}`, item);
};