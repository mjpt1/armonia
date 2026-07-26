const {PrismaClient}=require("@prisma/client");
const p=new PrismaClient();
Promise.all([p.user.count(), p.patient.count(), p.organization.count()]).then(([u,pa,o])=>{console.log({users:u,patients:pa,orgs:o}); return p.$disconnect();}).catch(e=>{console.error(e); process.exit(1);});
