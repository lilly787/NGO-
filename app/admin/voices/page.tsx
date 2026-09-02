import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { list } from "@/lib/cms";
import { remove } from "@/app/admin/actions";
export default async function VoicesAdmin(){if(!await isAdmin())redirect("/admin/login");const items=await list("voice");return <><p className="eyebrow">Content management</p><h1>GSEI Voices</h1><p><Link className="button primary" href="/admin/voices/new">Add article</Link></p>{items.length?<div className="admin-list">{items.map(item=><article className="feature" key={item.id}><p className="eyebrow">{item.status.toLowerCase()}</p><h2>{item.title}</h2><p>By {item.authorName}</p><div className="actions"><Link className="button" href={`/admin/voices/${item.id}/edit`}>Edit</Link><form action={remove.bind(null,"voice",item.id)}><button className="button danger">Delete</button></form></div></article>)}</div>:<div className="empty">No GSEI Voices articles have been created yet.</div>}</>}
