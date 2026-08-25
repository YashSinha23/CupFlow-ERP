import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "./api";
import { useState } from "react";
import styles from "./Page.module.css";
import { notify } from "../../lib/toast"; 

export default function Page() {
    const {login, isAuthenticated} = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({email : '', password: ''});
    const [isSubmitting, setIsSubmitting] = useState(false);

    if(isAuthenticated){
        return <Navigate to="/" replace />
    }

    function handleChange(e) {
        const {name, value} = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        if(isSubmitting) return;

        setIsSubmitting(true);

        try {
            const data = await loginUser(form.email, form.password);
            login(data);
            navigate("/");
        } catch (err) {
            notify.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <form className={styles.form} onSubmit={handleSubmit}>
                    <h1 className={styles.title}>Login Page</h1>
                    <div className={styles.field}>
                        <input 
                            className={styles.input}
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className={styles.field}>
                        <input 
                            className={styles.input}
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button className={styles.button} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    )
}