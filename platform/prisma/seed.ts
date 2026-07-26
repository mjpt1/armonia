import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Armonia demo DB…");

  // Clear in dependency order
  await prisma.activityLog.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.payroll.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.contract.deleteMany();
  await prisma.settlement.deleteMany();
  await prisma.commission.deleteMany();
  await prisma.installment.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.socialAccount.deleteMany();
  await prisma.contentItem.deleteMany();
  await prisma.waitlistEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.prescription.deleteMany();
  await prisma.treatmentHistory.deleteMany();
  await prisma.patientDocument.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.campaign.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.tariff.deleteMany();
  await prisma.clinicService.deleteMany();
  await prisma.service.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.clinic.deleteMany();
  await prisma.user.deleteMany();
  await prisma.branch.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.province.deleteMany();
  await prisma.country.deleteMany();
  await prisma.language.deleteMany();
  await prisma.organization.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.portfolioItem.deleteMany();
  await prisma.faqItem.deleteMany();

  const org = await prisma.organization.create({
    data: { name: "آرمونیا" },
  });

  await prisma.language.createMany({
    data: [
      { code: "fa", nameFa: "فارسی", rtl: true },
      { code: "en", nameFa: "انگلیسی", rtl: false },
      { code: "ar", nameFa: "عربی", rtl: true },
    ],
  });

  await prisma.brand.create({ data: { name: "آرمونیا" } });

  const ir = await prisma.country.create({
    data: {
      organizationId: org.id,
      nameFa: "ایران",
      nameEn: "Iran",
      code: "IR",
    },
  });

  const tehran = await prisma.province.create({
    data: { countryId: ir.id, nameFa: "تهران" },
  });
  const isfahan = await prisma.province.create({
    data: { countryId: ir.id, nameFa: "اصفهان" },
  });

  const bVanak = await prisma.branch.create({
    data: {
      provinceId: tehran.id,
      code: "THR-VAN",
      name: "ونک",
      city: "تهران",
      address: "ونک، خیابان ولیعصر",
      managerName: "فرهاد زمانی",
    },
  });
  const bSaadat = await prisma.branch.create({
    data: {
      provinceId: tehran.id,
      code: "THR-SAA",
      name: "سعادت‌آباد",
      city: "تهران",
      address: "سعادت‌آباد، میدان کاج",
      managerName: "مریم کاظمی",
    },
  });
  const bIsf = await prisma.branch.create({
    data: {
      provinceId: isfahan.id,
      code: "ISF-CTR",
      name: "اصفهان مرکز",
      city: "اصفهان",
      address: "خیابان چهارباغ",
      managerName: "علی رضایی",
    },
  });

  const roles: {
    role: string;
    name: string;
    email: string;
    initials: string;
    branchId?: string;
  }[] = [
    { role: "CEO", name: "سارا احمدی", email: "ceo@armonia.local", initials: "سا" },
    { role: "OPS", name: "رضا کریمی", email: "ops@armonia.local", initials: "رک", branchId: bVanak.id },
    { role: "SM", name: "مینا صالحی", email: "sm@armonia.local", initials: "مس", branchId: bVanak.id },
    { role: "SA", name: "نیلوفر رضایی", email: "sa@armonia.local", initials: "نر", branchId: bVanak.id },
    { role: "MM", name: "آرش نوری", email: "mm@armonia.local", initials: "آن" },
    { role: "ME", name: "هستی مرادی", email: "me@armonia.local", initials: "هم" },
    { role: "SOC", name: "پگاه جعفری", email: "soc@armonia.local", initials: "پج" },
    { role: "DES", name: "کیان طاهری", email: "des@armonia.local", initials: "کت" },
    { role: "VID", name: "امیر حسینی", email: "vid@armonia.local", initials: "اح" },
    { role: "CFO", name: "لیلا موسوی", email: "cfo@armonia.local", initials: "لم" },
    { role: "ACC", name: "بهرام قاسمی", email: "acc@armonia.local", initials: "بق", branchId: bVanak.id },
    { role: "HR", name: "نازنین اکبری", email: "hr@armonia.local", initials: "نا" },
    { role: "BM", name: "فرهاد زمانی", email: "bm@armonia.local", initials: "فز", branchId: bVanak.id },
    { role: "CM", name: "شیرین کاظمی", email: "cm@armonia.local", initials: "شک", branchId: bVanak.id },
    { role: "DOC", name: "دکتر مریم شریفی", email: "doc@armonia.local", initials: "مش", branchId: bVanak.id },
    { role: "AST", name: "سحر علوی", email: "ast@armonia.local", initials: "سع", branchId: bVanak.id },
    { role: "REC", name: "الهام نژاد", email: "rec@armonia.local", initials: "الن", branchId: bVanak.id },
    { role: "PAT", name: "زهرا محمدی", email: "patient@armonia.local", initials: "زم", branchId: bVanak.id },
  ];

  // Also support login page defaults (armonia.ir / armonia123)
  const users: Record<string, string> = {};
  for (const r of roles) {
    const u = await prisma.user.create({
      data: {
        branchId: r.branchId,
        email: r.email,
        password: "demo1234",
        name: r.name,
        initials: r.initials,
        role: r.role,
      },
    });
    users[r.role] = u.id;
  }

  // Alias emails for login page defaults
  await prisma.user.create({
    data: {
      email: "ceo@armonia.ir",
      password: "armonia123",
      name: "سارا احمدی",
      initials: "سا",
      role: "CEO",
    },
  });

  const cSkinVan = await prisma.clinic.create({
    data: { branchId: bVanak.id, name: "کلینیک پوست ونک", type: "پوست", capacity: 18 },
  });
  const cLaserVan = await prisma.clinic.create({
    data: { branchId: bVanak.id, name: "لیزر ونک", type: "لیزر", capacity: 12 },
  });
  await prisma.clinic.create({
    data: { branchId: bSaadat.id, name: "پوست سعادت‌آباد", type: "پوست", capacity: 14 },
  });
  await prisma.clinic.create({
    data: { branchId: bIsf.id, name: "تزریق اصفهان", type: "تزریقات", capacity: 10 },
  });

  const docMaryam = await prisma.doctor.create({
    data: {
      branchId: bVanak.id,
      clinicId: cSkinVan.id,
      name: "دکتر مریم شریفی",
      specialty: "پوست و زیبایی",
      experienceYears: 12,
      commissionPct: 35,
      scheduleNote: "شنبه تا چهارشنبه ۱۰–۱۸",
      contractNote: "قرارداد درصد فروش خدمات",
    },
  });
  const docAli = await prisma.doctor.create({
    data: {
      branchId: bVanak.id,
      clinicId: cLaserVan.id,
      name: "دکتر علی بهرامی",
      specialty: "لیزر و جوان‌سازی",
      experienceYears: 8,
      commissionPct: 30,
      scheduleNote: "یکشنبه و سه‌شنبه ۱۴–۲۰",
    },
  });
  const docSara = await prisma.doctor.create({
    data: {
      branchId: bVanak.id,
      clinicId: cSkinVan.id,
      name: "دکتر سارا نیکو",
      specialty: "تزریق فیلر و بوتاکس",
      experienceYears: 6,
      commissionPct: 32,
      scheduleNote: "پنجشنبه ۹–۱۵",
    },
  });

  const svcBotex = await prisma.service.create({
    data: {
      name: "بوتاکس",
      description: "تزریق بوتاکس نواحی پیشانی و دور چشم",
      category: "تزریقات",
      priceFrom: 4500000,
    },
  });
  const svcLaser = await prisma.service.create({
    data: {
      name: "لیزر الکساندرایت",
      description: "دورهٔ لیزر موهای زائد",
      category: "لیزر",
      priceFrom: 3200000,
    },
  });
  const svcFiller = await prisma.service.create({
    data: {
      name: "فیلر لب",
      description: "حجم‌دهی لب با فیلر هیالورونیک",
      category: "تزریقات",
      priceFrom: 7800000,
    },
  });
  const svcConsult = await prisma.service.create({
    data: {
      name: "مشاوره زیبایی",
      description: "مشاورهٔ اولیه",
      category: "مشاوره",
      priceFrom: 0,
    },
  });

  for (const s of [svcBotex, svcLaser, svcFiller, svcConsult]) {
    await prisma.clinicService.create({
      data: { serviceId: s.id, clinicId: cSkinVan.id },
    });
    await prisma.tariff.create({
      data: { serviceId: s.id, name: `تعرفه پایه ${s.name}`, amount: s.priceFrom },
    });
  }

  const campaign = await prisma.campaign.create({
    data: {
      branchId: bVanak.id,
      name: "کمپین بهار زیبایی",
      channel: "ads",
      budget: 120000000,
      spent: 45000000,
      leads: 4,
      status: "active",
      startDate: new Date(),
    },
  });

  await prisma.contentItem.create({
    data: {
      title: "ریلز قبل/بعد بوتاکس",
      channel: "instagram",
      status: "planned",
      scheduledAt: new Date(Date.now() + 86400000 * 2),
    },
  });
  await prisma.socialAccount.create({
    data: { platform: "instagram", handle: "@armonia.beauty", status: "active" },
  });

  await prisma.lead.createMany({
    data: [
      {
        branchId: bVanak.id,
        name: "نگار حسینی",
        mobile: "09121234567",
        service: "بوتاکس",
        source: "instagram",
        advisor: "نیلوفر رضایی",
        status: "follow",
        notes: "علاقه‌مند به بوتاکس پیشانی",
      },
      {
        branchId: bVanak.id,
        name: "مریم اکبری",
        mobile: "09129876543",
        service: "لیزر",
        source: "website",
        advisor: "نیلوفر رضایی",
        status: "lead",
      },
      {
        branchId: bSaadat.id,
        name: "سارا قاسمی",
        mobile: "09351234567",
        service: "فیلر لب",
        source: "referral",
        advisor: "مینا صالحی",
        status: "wait",
        notes: "منتظر نوبت دکتر نیکو",
      },
      {
        branchId: bVanak.id,
        name: "الهام رضوی",
        mobile: "09121112233",
        service: "بوتاکس",
        source: "ads",
        advisor: "نیلوفر رضایی",
        status: "win",
      },
    ],
  });

  const patient1 = await prisma.patient.create({
    data: {
      branchId: bVanak.id,
      name: "زهرا محمدی",
      nationalId: "0012345678",
      mobile: "09120001122",
      birthJalali: "۱۳۷۰/۰۳/۱۵",
      fileCode: "P-1405-001",
    },
  });
  const patient2 = await prisma.patient.create({
    data: {
      branchId: bVanak.id,
      name: "فاطمه نوری",
      nationalId: "0023456789",
      mobile: "09123334455",
      fileCode: "P-1405-002",
      birthJalali: "۱۳۶۵/۰۸/۲۰",
    },
  });
  await prisma.patient.create({
    data: {
      branchId: bSaadat.id,
      name: "مینا کاویانی",
      mobile: "09356667788",
      fileCode: "P-1405-003",
    },
  });

  await prisma.patientDocument.create({
    data: {
      patientId: patient1.id,
      title: "رضایت‌نامه درمان",
      kind: "consent",
      meta: "meta://consent-v1",
    },
  });
  await prisma.treatmentHistory.create({
    data: {
      patientId: patient1.id,
      title: "بوتاکس پیشانی",
      notes: "۲۰ واحد · بدون عارضه",
      dateJalali: "۱۴۰۵/۰۴/۱۰",
    },
  });
  await prisma.prescription.create({
    data: {
      patientId: patient1.id,
      doctorId: docMaryam.id,
      content: "کمپرس سرد · اجتناب از ورزش سنگین ۲۴ ساعت",
    },
  });

  await prisma.appointment.create({
    data: {
      branchId: bVanak.id,
      clinicId: cSkinVan.id,
      doctorId: docMaryam.id,
      patientId: patient1.id,
      patientName: patient1.name,
      mobile: patient1.mobile,
      service: "بوتاکس",
      startsAt: new Date(Date.now() + 86400000),
      status: "confirmed",
      kind: "default",
    },
  });
  await prisma.appointment.create({
    data: {
      branchId: bVanak.id,
      clinicId: cLaserVan.id,
      doctorId: docAli.id,
      patientId: patient2.id,
      patientName: patient2.name,
      mobile: patient2.mobile,
      service: "لیزر الکساندرایت",
      startsAt: new Date(Date.now() + 86400000 * 3),
      status: "booked",
      kind: "laser",
    },
  });
  await prisma.appointment.create({
    data: {
      branchId: bVanak.id,
      doctorId: docSara.id,
      patientId: patient1.id,
      patientName: patient1.name,
      service: "مشاوره زیبایی",
      startsAt: new Date(Date.now() - 86400000 * 2),
      status: "done",
      kind: "consult",
    },
  });

  await prisma.waitlistEntry.create({
    data: {
      name: patient2.name,
      mobile: patient2.mobile,
      service: "فیلر لب",
      preferredAt: new Date(Date.now() + 86400000 * 5),
      status: "waiting",
      notes: "صبح‌ها",
    },
  });

  await prisma.installment.create({
    data: {
      title: "اقساط فیلر لب",
      totalAmount: 7800000,
      paidAmount: 2600000,
      status: "open",
      patientName: patient1.name,
      dueDate: new Date(Date.now() + 86400000 * 20),
    },
  });

  await prisma.payment.create({
    data: {
      branchId: bVanak.id,
      patientId: patient1.id,
      kind: "in",
      amount: 2600000,
      method: "card",
      status: "paid",
      note: "قسط اول فیلر",
    },
  });
  await prisma.payment.create({
    data: {
      branchId: bVanak.id,
      kind: "out",
      amount: 900000,
      method: "transfer",
      status: "paid",
      note: "علی‌الحساب پورسانت دکتر شریفی",
    },
  });

  await prisma.commission.create({
    data: {
      doctorName: docMaryam.name,
      period: "1405-04",
      amount: 12500000,
      percent: 35,
      status: "pending",
    },
  });
  await prisma.settlement.create({
    data: {
      kind: "clinic",
      party: "کلینیک پوست ونک",
      amount: 42000000,
      period: "1405-04",
      status: "pending",
    },
  });
  await prisma.settlement.create({
    data: {
      kind: "doctor",
      party: docMaryam.name,
      amount: 12500000,
      period: "1405-04",
      status: "pending",
    },
  });

  await prisma.contract.create({
    data: {
      branchId: bVanak.id,
      patientId: patient1.id,
      partyType: "patient",
      title: "قرارداد درمان زیبایی",
      partyName: patient1.name,
      status: "signed",
      signedAt: new Date(),
      content: "مفاد قرارداد درمان …",
    },
  });
  await prisma.contract.create({
    data: {
      branchId: bVanak.id,
      partyType: "doctor",
      title: "قرارداد همکاری پزشک",
      partyName: docMaryam.name,
      status: "pending_sign",
      content: "درصد پورسانت ۳۵٪ …",
    },
  });

  const staff1 = await prisma.staff.create({
    data: {
      branchId: bVanak.id,
      name: "الهام نژاد",
      roleTitle: "پذیرش",
      mobile: "09120000001",
    },
  });
  const staff2 = await prisma.staff.create({
    data: {
      branchId: bVanak.id,
      name: "حسین مرادی",
      roleTitle: "منشی کلینیک",
      mobile: "09120000002",
    },
  });

  await prisma.attendance.create({
    data: { staffId: staff1.id, date: new Date(), status: "present" },
  });
  await prisma.leaveRequest.create({
    data: {
      staffId: staff2.id,
      fromDate: new Date(Date.now() + 86400000 * 7),
      toDate: new Date(Date.now() + 86400000 * 9),
      reason: "مرخصی استحقاقی",
      status: "pending",
    },
  });
  await prisma.payroll.create({
    data: {
      staffId: staff1.id,
      period: "1405-04",
      amount: 28000000,
      status: "approved",
    },
  });

  await prisma.ticket.create({
    data: {
      branchId: bVanak.id,
      assigneeId: users.OPS,
      requester: "الهام نژاد",
      subject: "اختلال در تقویم نوبت",
      body: "اسلات‌های دکتر بهرامی دوبل ثبت می‌شود",
      status: "open",
      priority: "high",
    },
  });
  await prisma.ticket.create({
    data: {
      requester: "زهرا محمدی",
      subject: "درخواست تغییر نوبت",
      body: "لطفاً نوبت فردا به هفتهٔ بعد منتقل شود",
      status: "in_progress",
      priority: "normal",
    },
  });

  await prisma.notification.create({
    data: {
      channel: "sms",
      toAddress: patient1.mobile,
      title: "یادآوری نوبت",
      body: `نوبت شما برای بوتاکس تأیید شد.`,
      status: "sent",
      userId: users.PAT,
    },
  });

  await prisma.activityLog.create({
    data: {
      userId: users.CEO,
      action: "seed",
      module: "system",
      detail: "دیتابیس دمو مقداردهی شد",
    },
  });

  await prisma.blogPost.createMany({
    data: [
      {
        slug: "botox-care",
        title: "مراقبت‌های بعد از بوتاکس",
        excerpt: "نکات ساده برای نتیجهٔ بهتر",
        body: "پس از تزریق بوتاکس از ماساژ ناحیه خودداری کنید…",
      },
      {
        slug: "laser-myths",
        title: "باورهای نادرست درباره لیزر",
        excerpt: "پاسخ به پرسش‌های پرتکرار",
        body: "لیزر روی پوست تیره نیز با دستگاه مناسب قابل انجام است…",
      },
    ],
  });

  await prisma.portfolioItem.createMany({
    data: [
      {
        title: "جوان‌سازی پوست",
        category: "بوتاکس",
        description: "نتیجه پس از دو هفته",
        imageUrl: "meta://portfolio-1",
      },
      {
        title: "لیزر موهای زائد",
        category: "لیزر",
        description: "جلسهٔ چهارم دوره",
        imageUrl: "meta://portfolio-2",
      },
      {
        title: "حجم‌دهی لب",
        category: "فیلر",
        description: "طبیعی و متناسب",
        imageUrl: "meta://portfolio-3",
      },
    ],
  });

  await prisma.faqItem.createMany({
    data: [
      {
        question: "آیا مشاوره رایگان است؟",
        answer: "بله، مشاورهٔ اولیه در شعب منتخب رایگان یا با هزینهٔ نمادین است.",
        order: 1,
      },
      {
        question: "چطور نوبت بگیرم؟",
        answer: "از صفحهٔ رزرو آنلاین یا تماس با پذیرش شعبه اقدام کنید.",
        order: 2,
      },
      {
        question: "آیا اقساط دارید؟",
        answer: "برای برخی خدمات امکان پرداخت اقساطی پس از تأیید مالی وجود دارد.",
        order: 3,
      },
    ],
  });

  console.log("Seed complete. campaign:", campaign.id);
  console.log("Demo password: demo1234 (also ceo@armonia.ir / armonia123)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
