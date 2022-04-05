import css from './SignInPopup.module.css';
import toast, { Renderable } from 'react-hot-toast';
import { signInWithGoogle } from '../../components/header/HeaderActions';

export function signInPopup(action: string): Renderable {
    return (
        <span className={css.container}>
            <p className={css.text}>{`To ${action}, please sign in first.`}</p>
            <button
                type="submit"
                className={`btn ${css.btnAction}`}
                onClick={(e) => {
                    e.preventDefault();
                    signInWithGoogle();
                    toast.dismiss();
                }}
            >
                Sign in
            </button>
        </span>
    );
}
