import { CupSoda } from "lucide-react";
import styles from "./CupCard.module.css";
import cup50 from "../../../assets/50ml.png"
import cup100 from "../../../assets/100ml.png"
import cup200 from "../../../assets/200ml.png"
import cup500 from "../../../assets/500ml.png"

function getCupIcon(cupName) {
    const capacity = parseInt(cupName);

    if(capacity > 200){
        return cup500;
    }
    if(capacity > 100 && capacity <= 200){
        return cup200;
    }
    if(capacity > 50 && capacity <= 100){
        return cup100;
    }
    return cup50;
}

export default function CupCard({ cup, onClick }) {
    
    return (
        <div className={styles.card} onClick={() => onClick(cup)}>
            {/* <CupSoda size={48} className={styles.icon} /> */}
            <img 
                src={getCupIcon(cup.cupName)}
                alt=""
                className={styles.icon}
            />
            <p className={styles.name}>{cup.cupName}</p>
        </div>
    );
}