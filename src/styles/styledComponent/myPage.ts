import styled from 'styled-components';
import { theme } from '../theme';

export const MyPageContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  padding: 40px;
  width: 100%;
`;

export const UserProfileWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 24rem;

  span {
    display: flex;
    justify-content: left;
    align-items: center;
    margin-bottom: 2rem;
    width: 18rem;
  }
`;

export const UserPostWrapper = styled.div`
  width: 72rem;
`;

export const UserNameWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto 30px auto;
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 28px;
    padding-right: 1rem;
    font-size: ${theme.fontSize.title32};
    font-weight: ${theme.fontWeight.bold};
    &:hover {
      cursor: pointer;
      color: ${(props) => props.theme.colors.gray40};
    }
  }
  button {
    width: 62px;
    height: 28px;
    font-size: 100%;
    background-color: ${(props) => props.theme.colors.gray30};
    color: ${(props) => props.theme.colors.white};
    border: none;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.colors.gray20};
      color: ${(props) => props.theme.colors.gray30};
    }
  }
`;

export const EditInputValue = styled.input`
  width: 14rem;
  height: 28px;
  font-size: ${theme.fontSize.title18};
  font-weight: ${theme.fontWeight.medium};
  border: none;
  border-radius: 8px;
  padding-right: 1rem;
  text-align: left;
  :focus {
    outline: none;
  }
  ::placeholder {
    text-align: left;
  }
`;

export const MyPageTimeWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  width: 18rem;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }
  button {
    width: 62px;
    height: 28px;
    font-size: 100%;
    background-color: ${(props) => props.theme.colors.gray30};
    color: ${(props) => props.theme.colors.white};
    border: none;
    border-radius: 10px;
    &:hover {
      cursor: pointer;
      background-color: ${(props) => props.theme.colors.gray20};
      color: ${(props) => props.theme.colors.gray30};
    }
  }
`;

export const UserBadge = styled.p`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 12px;
  width: 18rem;
  height: 6rem;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const ProfileNavWrapper = styled.div`
  width: 100%;
  margin-bottom: 2rem;
  display: flex;
  justify-content: left;
  align-items: center;
  button {
    width: 8rem;
    height: 32px;
    font-size: 100%;
    background-color: ${(props) => props.theme.colors.white};
    color: ${(props) => props.theme.colors.gray20};
    border: none;
    border-bottom: 2px solid ${(props) => props.theme.colors.gray10};
    &:hover {
      cursor: pointer;
      color: ${(props) => props.theme.colors.gray30};
      border-bottom: 2px solid ${(props) => props.theme.colors.gray30};
    }
  }
`;

export const CategoryListWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  padding: 12px;
  width: 100%;
  height: auto;
  background-color: ${(props) => props.theme.colors.gray10};
  color: ${(props) => props.theme.colors.gray30};
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const UserSellBuyWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 24px;
  div {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 12px;
    width: 50%;
    height: 320px;
    border-radius: 10px;
    background-color: ${(props) => props.theme.colors.gray10};
    color: ${(props) => props.theme.colors.gray30};
  }
`;
