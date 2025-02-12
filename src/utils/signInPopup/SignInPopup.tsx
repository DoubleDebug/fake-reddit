import css from './SignInPopup.module.css';
import { Link } from '@tanstack/react-router';
import toast, { Renderable } from 'react-hot-toast';

export function signInPopup(action: string): Renderable {
  return (
    <span className={css.container}>
      <p className={css.text}>{`To ${action}, please sign in first.`}</p>
      <Link to="/login" className={css.link}>
        <button
          type="submit"
          className={css.btnAction}
          onClick={() => toast.dismiss()}
        >
          Sign in
        </button>
      </Link>
    </span>
  );
}
