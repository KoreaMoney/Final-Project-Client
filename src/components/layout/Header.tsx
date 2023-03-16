import { auth } from '../../firebase/Firebase';
import { signOut } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';
import { BsPersonCircle } from 'react-icons/bs';
import { useCallback, useEffect, useRef, useState } from 'react';
import { theme } from '../../styles/theme';
import * as a from '../../components/detail/PostInfo/PostInfoStyle';
import {
  motion,
  useAnimation,
  useMotionValueEvent,
  useScroll,
} from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { getOnSalePostTotalSeller } from '../../api';
import { viewHeaderBuyerModalAtom } from '../../atom';
import { useRecoilState } from 'recoil';
import SearchInput from '../etc/SearchInput';
import styled from 'styled-components';
import loadable from '@loadable/component';

const HeaderBuyerModal = loadable(() => import('../modal/HeaderbuyerModal'));

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const navAnimation = useAnimation();
  const dropDownRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [writeActive, setWriteActive] = useState(false);
  const [isDrop, setIsDrop] = useState(false);
  const [isModalActive, setIsModalActive] = useRecoilState(
    viewHeaderBuyerModalAtom
  );

  //JSON서버 섹션스토리지 작성하기
  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');

  //y축 이동 사항 확인
  useMotionValueEvent(scrollY, 'change', () => {
    if (scrollY.get() > 80) {
      navAnimation.start('scroll');
    } else {
      navAnimation.start('top');
    }
  });

  //로그아웃 버튼
  const handelClickLogOut = () => {
    signOut(auth)
      .then(() => {
        navigate('/signin');
      })
      .catch((error) => {
        console.dir('LoginErr:', error);
      });
  };

  const writeActiveChange = () => {
    if (!navigate) {
      setWriteActive(false);
    }
    navigate('/writepage');
    setWriteActive(true);
    setActiveIndex(-1);
  };

  const handleClick = (index: any) => {
    setActiveIndex(index);
    setWriteActive(false);
  };

  useEffect(() => {
    const handlePopState = () => {
      setWriteActive(false);
      setActiveIndex(-1);
    };
    window.onpopstate = handlePopState;
    return () => {
      window.onpopstate = null;
    };
  }, []);
  //드롭다운 밖의 영역 클릭시 사라짐
  useEffect(() => {
    const clickOustSide = (event: MouseEvent) => {
      if (
        dropDownRef.current &&
        !dropDownRef.current.contains(event.target as Node)
      ) {
        setIsDrop(false);
      }
    };
    document.addEventListener('click', clickOustSide);
    return () => {
      document.removeEventListener('click', clickOustSide);
    };
  }, []);

  useEffect(() => {
    // 라우트가 변경될 때마다 activeIndex 상태 업데이트
    categories.forEach((category, index) => {
      if (location.pathname === category.path) {
        setActiveIndex(index);
      }
    });
  }, [activeIndex, location]);

  const categories = [
    { label: '전체', path: '/categorypage/all' },
    { label: '공부', path: '/categorypage/study' },
    { label: '놀이', path: '/categorypage/play' },
    { label: '상담', path: '/categorypage/advice' },
    { label: '기타', path: '/categorypage/etc' },
  ];

  const { data: headerSeller, refetch } = useQuery(
    ['onHeaderSeller', saveUser?.uid],
    () => getOnSalePostTotalSeller(saveUser?.uid),
    {
      onSuccess: () => {
        setTimeout(() => {
          refetch();
        }, 20000);
      },
    }
  );

  const waitTradeCount = headerSeller?.length;

  const onClickToggleModal = useCallback(() => {
    setIsModalActive(!isModalActive);
  }, [isModalActive]);

  return (
    <Nav variants={navVariants} animate={navAnimation} initial={'top'}>
      <HeaderContainer>
        <HeaderWrapper>
          <Link
            to="/"
            aria-label="홈으로 이동"
            onClick={() => {
              setWriteActive(false);
              setActiveIndex(-1);
            }}
          >
            <Logo />
          </Link>
          <CategoryWrapper>
            <Items>
              {categories.map((category, index) => (
                <Item
                  key={index}
                  className={activeIndex === index ? 'active' : ''}
                >
                  <Link
                    to={category.path}
                    onClick={() => handleClick(index)}
                    aria-label={category.label}
                  >
                    {category.label}
                  </Link>
                </Item>
              ))}
            </Items>
          </CategoryWrapper>
        </HeaderWrapper>
        <HeaderRightContainer>
          <HeaderRightWrapper>
            <SearchInput />
            <HeaderRightInfo>
              {saveUser && (
                <>
                  <span ref={dropDownRef}>
                    <CountWrapper>
                      <BsPersonCircle
                        size={36}
                        onClick={() => setIsDrop(!isDrop)}
                      />
                      <Count> {waitTradeCount}</Count>
                    </CountWrapper>
                    <a.DropDownContainer>
                      {isDrop && (
                        <DropDownBox>
                          <Link
                            to={`/mypage/${saveUser.uid}`}
                            aria-label="마이페이지 이동"
                            onClick={() => {
                              setWriteActive(false);
                              setIsDrop(!isDrop);
                            }}
                          >
                            <a.DropDownButton aria-label="마이페이지">
                              마이페이지
                            </a.DropDownButton>
                          </Link>
                          <a.DropDownButton
                            onClick={onClickToggleModal}
                            aria-label="매칭 중"
                          >
                            매칭 중 ({waitTradeCount})
                          </a.DropDownButton>
                        </DropDownBox>
                      )}
                    </a.DropDownContainer>
                    <HeaderBuyerModal salePosts={headerSeller} />
                  </span>
                  <WriteBtn
                    className={writeActive ? 'active' : ''}
                    onClick={writeActiveChange}
                    aria-label="글쓰기"
                  >
                    글쓰기
                  </WriteBtn>
                </>
              )}

              <LogOutBtn
                onClick={() => handelClickLogOut()}
                aria-label="로그아웃"
              >
                {!saveUser ? '로그인' : '로그아웃'}
              </LogOutBtn>
            </HeaderRightInfo>
          </HeaderRightWrapper>
        </HeaderRightContainer>
      </HeaderContainer>
    </Nav>
  );
};
export default Header;

const Nav = styled(motion.nav)`
  display: flex;
  align-items: center;
  position: sticky;
  height: 90px;
  width: 100vw;
  top: 0;
  padding: 20px 60px;
  z-index: 10;
  color: ${(props) => props.theme.colors.black};
`;

const Count = styled.div`
  background-color: ${theme.colors.red};
  display: flex;
  position: absolute;
  font-size: 11px;
  color: white;
  right: 302px;
  top: 18px;
  width: 25px;
  height: 25px;
  border-radius: 100%;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 2px 2px 0 ${theme.colors.gray30};
`;

const CountWrapper = styled.div`
  display: flex;
  flex-direction: row;
  cursor: pointer;
`;

const navVariants = {
  top: {
    backgroundColor: 'rgba(255,255,255,1)',
    borderBottom: '1px solid rgba(255,255,255,0)',
  },

  scroll: {
    backgroundColor: 'rgba(255,255,255,1)',
    borderBottom: '1px solid rgba(194,193,193,1)',
  },
};

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 100%;
  height: 40px;
  justify-content: space-between;
`;
const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  text-align: center;
  width: 50%;
  height: 42px;
`;

const Logo = styled.div`
  display: flex;
  width: 170px;
  height: 42px;
  font-size: ${(props) => props.theme.fontSize.title32};
  font-weight: ${(props) => props.theme.fontWeight.bold};
  background: url('https://ifh.cc/g/TqgLJX.webp') no-repeat;
`;

const CategoryWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: ${(props) => props.theme.fontWeight.medium};
  font-size: ${(props) => props.theme.fontSize.title20};
  width: 410px;
  height: 20px;
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 40px;
  width: 50px;
  transition: color 0.3s ease-in-out;
  color: ${(props) => props.theme.colors.black};
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: pointer;
  &:hover {
    color: ${(props) => props.theme.colors.orange02Main};
  }
  &.active {
    color: ${(props) => props.theme.colors.orange02Main};
    font-weight: ${theme.fontWeight.bold};
  }
`;

const HeaderRightContainer = styled.div`
  width: 50%;
`;

const HeaderRightWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 42px;
  width: 100%;
`;

const HeaderRightInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  width: 70%;
`;

const DropDownBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  font-size: ${theme.fontSize.title16};
  top: 5px;
  left: 35px;
  width: 125px;
  border-radius: 0 10px 10px 10px;
  border: 1px solid ${(props) => props.theme.colors.gray20};
  background-color: ${(props) => props.theme.colors.white};
`;

const WriteBtn = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border: 2px solid ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.black};
  border-radius: 23px;
  width: 81px;
  height: 40px;
  margin-left: 40px;

  cursor: pointer;
  &:hover {
    border: 2px solid ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.orange02Main};
  }
  &.active {
    border: 3px solid ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.orange02Main};
    font-weight: ${theme.fontWeight.bold};
  }
`;

const LogOutBtn = styled.button`
  background-color: transparent;
  font-size: ${(props) => props.theme.fontSize.title18};
  font-weight: ${(props) => props.theme.fontWeight.medium};
  border: 2px solid ${(props) => props.theme.colors.black};
  color: ${(props) => props.theme.colors.black};
  border-radius: 23px;
  width: 94px;
  height: 40px;
  margin-left: 40px;

  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.colors.orange02Main};
    color: ${(props) => props.theme.colors.orange02Main};
  }
`;
