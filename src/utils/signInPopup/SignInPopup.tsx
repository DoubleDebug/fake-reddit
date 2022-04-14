import css from './SignInPopup.module.css';
import toast, { Renderable } from 'react-hot-toast';
import { Link } from 'react-router-dom';

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
