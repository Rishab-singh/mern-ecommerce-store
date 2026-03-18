import { CheckCircle, AlertCircle, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function Message({ type, text }) {

const styles = {
success: {
bg: "bg-green-50",
text: "text-green-700",
border: "border-green-200",
icon: <CheckCircle size={18}/>
},
error: {
bg: "bg-red-50",
text: "text-red-700",
border: "border-red-200",
icon: <AlertCircle size={18}/>
},
info: {
bg: "bg-blue-50",
text: "text-blue-700",
border: "border-blue-200",
icon: <Info size={18}/>
}
};

const style = styles[type] || styles.info;

return (

<motion.div
initial={{opacity:0,y:-10}}
animate={{opacity:1,y:0}}
exit={{opacity:0}}
className={`flex items-center gap-3 p-3 rounded-lg border ${style.bg} ${style.text} ${style.border}`}
>

<div className="flex-shrink-0">
{style.icon}
</div>

<p className="text-sm font-medium">
{text}
</p>

</motion.div>

);

}