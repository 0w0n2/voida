import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore, type User } from '@/stores/authStore';
import { getUser } from '@/apis/auth/userApi';
import { reissueToken } from '@/apis/auth/authApi';
import { useAlertStore } from '@/stores/useAlertStore';

const CallbackPage = () => {
  //  토큰 재발급 후 
  const giveMeToken = async() => {
    try {
      const res = await reissueToken()
      const newAccessToken = res.headers.authorization;
      localStorage.setItem('accessToken', newAccessToken);

      // 토큰 재발급 후 유저 정보 조회
      const response = await getUser();
      const user: User = {
        email: response.data.result.member.email,
        nickname: response.data.result.member.nickname,
        profileImage: response.data.result.member.profileImageUrl || '',
        memberUuid: response.data.result.member.memberUuid,
      };
      setUser(user);

      // 로그인 성공 후 isNewbie 파라미터에 따라 이동
      const isNewbie = params.get('isNewbie');
      console.log(isNewbie);
      if (isNewbie === 'true') {
        navigate('/tutorial');
      } else {
        navigate('/main');
      }
    } catch (e) {
      console.log(e);
      useAlertStore.getState().showAlert('세션이 만료되었습니다. 다시 로그인해주세요.', 'top');
		  navigate('/login');
    }
  }

  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  useEffect(() => {
    const isFirstLogin = params.get('isFirstLogin');
    const code = params.get('code');

    switch (code) {
      case "200":
        if (isFirstLogin === 'true') {
          navigate('/register', {
            state: { socialEmail: params.get('email'), providerName: params.get('providerName') },
          });
        } else { 
          giveMeToken();
        }
        break;
      case "1003":
        navigate('/login');
        useAlertStore
          .getState()
          .showAlert('이미 가입된 계정입니다. 이메일 로그인 방식을 사용해주세요.', 'top');
        break;
      case "1004":
        navigate('/mypage');
        useAlertStore
          .getState()
          .showAlert('이미 사용 중인 소셜 계정입니다. 다른 계정을 사용해주세요.', 'top');
        break;
      case "1005":
        navigate('/mypage');
        useAlertStore
          .getState()
          .showAlert('계정 연동 시간이 만료되었습니다. 다시 시도해주세요.', 'top');
        break;
      default:
        navigate('/social-error');
        useAlertStore
          .getState()
          .showAlert('서버 오류입니다. 잠시 후 다시 시도해주세요.', 'top');
        break;
    }       
  }, [params, navigate]);
  return <></>;
};
export default CallbackPage;