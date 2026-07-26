const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
p.user.count().then(c=>{console.log("user_count",c); return p.$disconnect();}).catch(e=>{console.error("ERR",e); process.exit(1);});
