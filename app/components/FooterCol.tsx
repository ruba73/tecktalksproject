type link={
    label:string;
    href:string;
}
type footerColProps={
    title:string;
    links:link[];
}
export default function FooterCol({ title,...rest}:footerColProps) {
    const {links}=rest;
    return (
        <div className="text-sm">
            <div className="mb-3 font-semibold">{title}</div>
            <ul className="space-y-2 text-black/60">
                {
                    links.map((link,index)=>(
                        <li key={index}><a href={link.href}>{link.label}</a></li>
                    ))
                }
            </ul>
        </div>
    );
}
