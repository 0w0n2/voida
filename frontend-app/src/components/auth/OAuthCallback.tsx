import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { getUser } from '@/apis/auth/userApi';
import { reissueToken } from '@/apis/auth/authApi';
const CallbackPage = () => {
  //  토큰 재발급 후 
  const giveMeToken = async() => {
    try {
      const res = await reissueToken()
      const newAccessToken = res.headers.authorization;

      // 토큰 재발급 후 유저 정보 조회
      const getUserres = await getUser(newAccessToken);
      const profileImageUrl = getUserres.data.member.profileImageUrl
      const nickname = getUserres.data.member.nickname
      const email = getUserres.data.member.email
      const user = {
        profileImageUrl: profileImageUrl,
        nickname: nickname,
        email: email,
      };

      // 유저 정보 저장
      setAuth(newAccessToken, user);
    

    } catch (error) {
      console.error('토큰 재발급 실패:', error);
    }
  }

  

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  useEffect(() => {
    const result = params.get('result');
    const accessToken = params.get('accessToken');
    const email = params.get('email');
    const isNewbie = params.get('isNewbie');

    if (!result) return;

    if (result === 'success' && accessToken) {
      setAuth(accessToken, null);

      getUser(accessToken)
        .then((response) => {
          const user = response.data.member;
          setAuth(accessToken, user);

          if (isNewbie === 'true') {
            navigate('/tutorial');
          } else {
            navigate('/main');
          }
        })
        .catch(() => {
          navigate('/register');
        });
    }

    if (result === 'need_signup') {
      navigate('/register', {
        state: { socialEmail: email },
      });
    }
  }, []);
  return <></>;
};
export default CallbackPage;
