type sectionCardType={
    label:string,
    info:string
}
export default function Section({label,info}:sectionCardType){
    return(
        <div>
            <div className="text-xl font-bold">{label}</div>
            <div className="text-xs text-black/50">{info}</div>
        </div>
    );
}