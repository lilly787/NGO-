"use server";
import {redirect} from "next/navigation";import {revalidatePath} from "next/cache";import {isAdmin} from "@/lib/auth";import {prisma} from "@/lib/prisma";import {cleanContent,toSlug,Kind} from "@/lib/cms";import {ContentStatus} from "@prisma/client";
async function allowed(){if(!await isAdmin())redirect("/admin/login")}

async function generateUniqueSlug(kind: Kind, baseSlug: string): Promise<string> {
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const exists = kind === "news" 
      ? await prisma.news.findUnique({ where: { slug } })
      : await prisma.voice.findUnique({ where: { slug } });
    if (!exists) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}

export async function save(kind:Kind,id:string|undefined,form:FormData){
  await allowed();
  const title=String(form.get("title")||"").trim();
  const status:ContentStatus=form.get("status")==="PUBLISHED"?ContentStatus.PUBLISHED:ContentStatus.DRAFT;
  
  if(!title)throw new Error("Title is required.");

  const data: any = {
    title,
    featuredImage:String(form.get("featuredImage")||"")||null,
    content:cleanContent(String(form.get("content")||"")),
    status,
  };

  if(!data.content)throw new Error("Content is required.");

  // Handle publishedAt logic
  if (status === ContentStatus.PUBLISHED) {
    // If it's already published, we don't want to change the publishedAt date.
    // We'll let the specific update logic handle preserving it if needed, or set it if new.
  } else {
    data.publishedAt = null;
  }

  if(kind==="news"){
    if(id) {
      const existing = await prisma.news.findUnique({where: {id}});
      if (!existing) throw new Error("Not found");
      if (status === ContentStatus.PUBLISHED && !existing.publishedAt) data.publishedAt = new Date();
      await prisma.news.update({where:{id},data});
    } else {
      data.slug = await generateUniqueSlug("news", toSlug(title));
      if (status === ContentStatus.PUBLISHED) data.publishedAt = new Date();
      await prisma.news.create({data});
    }
  }else{
    const voiceData={...data,authorName:String(form.get("authorName")||"").trim(),authorRole:String(form.get("authorRole")||"")||null,references:String(form.get("references")||"")||null};
    if(!voiceData.authorName)throw new Error("Author name is required.");
    if(id) {
      const existing = await prisma.voice.findUnique({where: {id}});
      if (!existing) throw new Error("Not found");
      if (status === ContentStatus.PUBLISHED && !existing.publishedAt) voiceData.publishedAt = new Date();
      await prisma.voice.update({where:{id},data:voiceData});
    } else {
      voiceData.slug = await generateUniqueSlug("voice", toSlug(title));
      if (status === ContentStatus.PUBLISHED) voiceData.publishedAt = new Date();
      await prisma.voice.create({data:voiceData});
    }
  }
  revalidatePath("/news");
  revalidatePath("/gsei-voices");
  redirect(`/admin/${kind==="news"?"news":"voices"}`);
}

export async function remove(kind:Kind,id:string){await allowed();if(kind==="news")await prisma.news.delete({where:{id}});else await prisma.voice.delete({where:{id}});revalidatePath("/news");revalidatePath("/gsei-voices");redirect(`/admin/${kind==="news"?"news":"voices"}`)}
