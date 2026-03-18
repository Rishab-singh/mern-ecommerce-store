import { Star } from "lucide-react";

export default function Rating({ value = 0, reviews }) {

const stars = [];

for (let i = 1; i <= 5; i++) {

stars.push(

<Star
key={i}
size={18}
className={`transition ${
value >= i
? "fill-yellow-400 text-yellow-400"
: "text-gray-300"
}`}
/>

);

}

return (

<div className="flex items-center gap-2">

<div className="flex items-center">
{stars}
</div>

{reviews !== undefined && (
<span className="text-sm text-gray-500">
({reviews} reviews)
</span>
)}

</div>

);

}
