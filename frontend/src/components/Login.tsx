import { sign } from 'crypto'
import { signInWithPopup ,} from 'firebase/auth'
import React from 'react'
import { auth, provider } from '../firebase'

function Login() {
  const signin = () => {
    console.log("ログインボタンが押されました");
    signInWithPopup(auth, provider)
      .then((result) => {
        // 認証成功時の処理
      })
      .catch((error) => {
        // エラー処理
        console.error("認証エラー:", error);
      });
  };
  return (
    <div>
<button onClick={signin}><p>ログイン</p></button>
    </div>
  )
}

export default Login


