import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auth } from '../firebase/Firebase';
import { getOnSalePost } from '../api';
import { IoExitOutline } from 'react-icons/io5';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isCancelAtom, isDoneAtom, onSalePostAtom } from '../atom';

import Loader from '../components/etc/Loader';
import * as a from '../styles/styledComponent/detail';
import PostImg from '../components/detail/PostImg';
import PostInfo from '../components/transaction/PostInfo/PostInfo';
import Content from '../components/transaction/content/Content';
import OnSalePostImg from '../components/transaction/OnSalePostImg';

/**순서
 * 1. query-key만들기
 * 2. 판매자, 구매자 데이터 가져오기
 * 3. 포인트 취소, 완료, 환불 기능추가하기
 */
const Transaction = () => {
  const navigate = useNavigate();

  const saveUser = JSON.parse(sessionStorage.getItem('user') || 'null');
  const queryClient = useQueryClient();

  auth.onAuthStateChanged((user: any) => setCurrent(user?.uid));

  const { uuid } = useParams();
  const [current, setCurrent] = useState(false);

  const isDone = useRecoilValue(isDoneAtom);
  const isCancel = useRecoilValue(isCancelAtom);
  const setOnSalePost = useSetRecoilState(onSalePostAtom);

  const onClickBtn = () => {
    navigate(-1);
  };

  /**onSalePost 데이터 가지고오기 */
  const { data, isLoading } = useQuery(
    ['salePost', uuid],
    () => getOnSalePost(uuid),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries(['salePost0', uuid]);
        setOnSalePost(data);
      },
      refetchOnMount: 'always',
      refetchOnReconnect: 'always',
      refetchOnWindowFocus: 'always',
    }
  );

  //로딩 구간
  if (isLoading) {
    return <Loader />;
  }
  if (!data || data.length === 0) {
    return <div>추가적인 데이터가 없습니다</div>;
  }

  //회원가입 된 유저가 아니라면 로그인 화면으로 이동합니다.
  if (!saveUser) {
    navigate('/signin');
  }

  return (
    <a.DetailContainer>
      <a.DetailWrapper>
        {isDone && (
          <a.TransactionText>
            <button onClick={onClickBtn} aria-label="매칭 연결">
              <IoExitOutline size={50} />
            </button>
            <h1>거래가 완료되었습니다.</h1>
          </a.TransactionText>
        )}
        {isCancel && (
          <a.TransactionText>
            <button onClick={onClickBtn} aria-label="매칭 취소">
              <IoExitOutline size={50} />
            </button>
            <h1>거래가 취소되었습니다.</h1>
          </a.TransactionText>
        )}
        <a.PostContainer>
          <OnSalePostImg />
          <PostInfo />
        </a.PostContainer>
        <Content />
      </a.DetailWrapper>
    </a.DetailContainer>
  );
};

export default Transaction;
