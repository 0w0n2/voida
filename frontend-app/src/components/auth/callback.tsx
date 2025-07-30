import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/store';
import { getUser } from '@/apis/userApi';

const CallbackPage = () => {
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
  return <></>
};
export default CallbackPage;
