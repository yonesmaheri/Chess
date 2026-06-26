"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("../src/generated/prisma/client");
const adapter = new adapter_pg_1.PrismaPg({
    connectionString: process.env.DATABASE_URL ?? '',
});
const prisma = new client_1.PrismaClient({ adapter });
const categories = [
    {
        slug: 'fundamentals',
        name: 'مبانی',
        description: 'مفاهیم پایه و اصول شروع یادگیری شطرنج.',
    },
    {
        slug: 'strategy',
        name: 'استراتژی',
        description: 'ساختارهای استراتژیک و تصمیم‌گیری در بازی.',
    },
    {
        slug: 'tactics',
        name: 'تاکتیک',
        description: 'الگوهای تاکتیکی و موقعیت‌های محاسباتی.',
    },
];
const instructors = [
    {
        name: 'استاد ایمان کوباریان',
        bio: 'مربی شطرنج با تمرکز بر آموزش مفاهیم پایه و شکل‌دادن ذهنیت تحلیلی بازیکنان.',
        avatarImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'استاد پویا نیک‌فر',
        bio: 'متخصص ساختار پیاده‌ها و برنامه‌ریزی استراتژیک در شطرنج رقابتی.',
        avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'استاد آرش رضایی',
        bio: 'تحلیل‌گر شطرنج با رویکرد تهاجمی و تمرکز بر ابتکار عمل در میان‌بازی.',
        avatarImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'استاد علی محمدی',
        bio: 'مدرس تاکتیک‌های عملی و حل تمرین برای بازیکنان باشگاهی و رقابتی.',
        avatarImage: 'https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'استاد بابک ولی‌زاده',
        bio: 'مربی سبک‌های ترکیبی با تاکید بر هماهنگی حمله و استراتژی در بازی.',
        avatarImage: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?auto=format&fit=crop&w=200&q=80',
    },
    {
        name: 'استاد فرهاد سلطانی',
        bio: 'مدرس اصول استراتژیک و انتخاب پلان در موقعیت‌های کلاسیک شطرنج.',
        avatarImage: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=200&q=80',
    },
];
const courseSeeds = [
    {
        title: 'اصول و مبانی شطرنج',
        slug: 'fundamentals-of-chess',
        description: 'این دوره پایه‌ای، قوانین، اصول توسعه، کنترل مرکز و ساختار ذهنی لازم برای شروع حرفه‌ای شطرنج را پوشش می‌دهد.',
        thumbnailImage: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/fundamentals-preview.mp4',
        level: client_1.CourseLevel.beginner,
        categorySlug: 'fundamentals',
        instructorName: 'استاد ایمان کوباریان',
        rating: 4.8,
        reviewCount: 356,
        studentCount: 2850,
        duration: '۶ ساعت',
        totalLessons: 9,
        price: 1490000,
        chapters: [
            {
                title: 'قوانین و هدف بازی',
                lessons: [
                    { title: 'صفحه و حرکت مهره‌ها', duration: '12:30', isPreview: true },
                    { title: 'قوانین ویژه و کیش', duration: '16:20', isPreview: false },
                    { title: 'مات و تساوی', duration: '14:10', isPreview: false },
                ],
            },
            {
                title: 'اصول شروع بازی',
                lessons: [
                    { title: 'کنترل مرکز', duration: '18:00', isPreview: false },
                    { title: 'توسعه صحیح مهره‌ها', duration: '17:45', isPreview: false },
                    { title: 'امنیت شاه', duration: '15:10', isPreview: false },
                ],
            },
            {
                title: 'برنامه‌ریزی پایه',
                lessons: [
                    { title: 'اشتباهات رایج مبتدیان', duration: '14:20', isPreview: false },
                    { title: 'انتخاب حرکت منطقی', duration: '16:10', isPreview: false },
                    { title: 'تحلیل یک بازی نمونه', duration: '19:30', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'محمد رضا', rating: 5, comment: 'برای شروع مسیر یادگیری شطرنج بسیار منظم و کاربردی بود.' },
            { authorName: 'سارا احمدی', rating: 4, comment: 'مفاهیم پایه با مثال‌های خوب توضیح داده شده‌اند.' },
        ],
    },
    {
        title: 'ساختار پیاده‌ها',
        slug: 'pawn-structures',
        description: 'در این دوره ساختارهای مختلف پیاده‌ای، نقاط ضعف و قوت هر ساختار و چگونگی استخراج پلان از آن‌ها آموزش داده می‌شود.',
        thumbnailImage: 'https://images.unsplash.com/photo-1528819622765-d6bcf132f793?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/pawn-structures-preview.mp4',
        level: client_1.CourseLevel.intermediate,
        categorySlug: 'strategy',
        instructorName: 'استاد پویا نیک‌فر',
        rating: 4.7,
        reviewCount: 241,
        studentCount: 1870,
        duration: '۷ ساعت و ۲۰ دقیقه',
        totalLessons: 9,
        price: 1890000,
        chapters: [
            {
                title: 'مبانی ساختار پیاده‌ها',
                lessons: [
                    { title: 'جزایر پیاده‌ای', duration: '17:25', isPreview: true },
                    { title: 'پیاده‌های ضعیف', duration: '15:45', isPreview: false },
                    { title: 'خانه‌های ضعیف', duration: '18:05', isPreview: false },
                ],
            },
            {
                title: 'ساختارهای کلاسیک',
                lessons: [
                    { title: 'پیاده معلق', duration: '19:15', isPreview: false },
                    { title: 'پیاده معکوس و ایزوله', duration: '18:00', isPreview: false },
                    { title: 'زنجیره پیاده‌ای', duration: '16:50', isPreview: false },
                ],
            },
            {
                title: 'پلان‌سازی از روی ساختار',
                lessons: [
                    { title: 'ستون باز و نیمه‌باز', duration: '15:35', isPreview: false },
                    { title: 'تعویض مناسب مهره‌ها', duration: '17:40', isPreview: false },
                    { title: 'تحلیل نمونه بازی', duration: '20:30', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'نرگس توکلی', rating: 5, comment: 'برای فهم ارتباط ساختار و پلان بسیار کمک‌کننده بود.' },
            { authorName: 'امیرحسین مرادی', rating: 4, comment: 'نمونه بازی‌های دوره فوق‌العاده‌اند.' },
        ],
    },
    {
        title: 'ابتکار عمل در شطرنج',
        slug: 'initiative-in-chess',
        description: 'یاد می‌گیرید چگونه ریتم بازی را به دست بگیرید، تهدید بسازید و با حفظ فشار، حریف را به دفاع منفعل وادار کنید.',
        thumbnailImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/initiative-preview.mp4',
        level: client_1.CourseLevel.advanced,
        categorySlug: 'strategy',
        instructorName: 'استاد آرش رضایی',
        rating: 4.9,
        reviewCount: 198,
        studentCount: 1560,
        duration: '۸ ساعت و ۱۰ دقیقه',
        totalLessons: 9,
        price: 2290000,
        chapters: [
            {
                title: 'شناخت ابتکار عمل',
                lessons: [
                    { title: 'تمپو و زمان', duration: '16:20', isPreview: true },
                    { title: 'تهدیدهای پیوسته', duration: '18:15', isPreview: false },
                    { title: 'فضا و آزادی عمل', duration: '17:25', isPreview: false },
                ],
            },
            {
                title: 'تبدیل فشار به برتری',
                lessons: [
                    { title: 'مهار مهره‌های حریف', duration: '19:20', isPreview: false },
                    { title: 'گسترش جبهه حمله', duration: '21:10', isPreview: false },
                    { title: 'مدیریت ریسک', duration: '15:45', isPreview: false },
                ],
            },
            {
                title: 'مطالعات عملی',
                lessons: [
                    { title: 'تحلیل بازی‌های مدرن', duration: '22:00', isPreview: false },
                    { title: 'تمرین تصمیم‌گیری', duration: '18:40', isPreview: false },
                    { title: 'جمع‌بندی الگوها', duration: '14:55', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'بردیا کاظمی', rating: 5, comment: 'سطح تحلیل بسیار حرفه‌ای و آموزنده است.' },
            { authorName: 'محسن هاشمی', rating: 5, comment: 'برای بازیکنان رقابتی کاملا ارزشمند است.' },
        ],
    },
    {
        title: 'تاکتیک‌های ضروری',
        slug: 'essential-tactics',
        description: 'الگوهای تاکتیکی پرکاربرد، مات‌های کلاسیک و روش‌های محاسبه‌ای لازم برای برنده شدن در موقعیت‌های حساس را یاد می‌گیرید.',
        thumbnailImage: 'https://images.unsplash.com/photo-1604948501466-4e9c339b9c24?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/essential-tactics-preview.mp4',
        level: client_1.CourseLevel.intermediate,
        categorySlug: 'tactics',
        instructorName: 'استاد علی محمدی',
        rating: 4.8,
        reviewCount: 412,
        studentCount: 3710,
        duration: '۶ ساعت و ۴۵ دقیقه',
        totalLessons: 9,
        price: 1790000,
        chapters: [
            {
                title: 'الگوهای پایه',
                lessons: [
                    { title: 'چنگال', duration: '14:40', isPreview: true },
                    { title: 'پین و اسکیور', duration: '18:20', isPreview: false },
                    { title: 'حمله مکشوف', duration: '17:30', isPreview: false },
                ],
            },
            {
                title: 'ترکیب الگوها',
                lessons: [
                    { title: 'قربانی برای مات', duration: '19:10', isPreview: false },
                    { title: 'تاکتیک روی شاه', duration: '20:00', isPreview: false },
                    { title: 'اشتباهات محاسباتی رایج', duration: '15:15', isPreview: false },
                ],
            },
            {
                title: 'تمرینات کاربردی',
                lessons: [
                    { title: 'حل تست زمانی', duration: '16:30', isPreview: false },
                    { title: 'بررسی بازی‌ها', duration: '19:35', isPreview: false },
                    { title: 'نقشه راه تمرین', duration: '13:50', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'علی رضوانی', rating: 5, comment: 'پر از مثال‌های مفید و قابل‌استفاده در بازی واقعی است.' },
            { authorName: 'بهار جعفری', rating: 4, comment: 'برای افزایش قدرت محاسبه خیلی مناسب بود.' },
        ],
    },
    {
        title: 'ترکیب حمله و استراتژی',
        slug: 'attack-and-strategy',
        description: 'این دوره نشان می‌دهد چگونه طرح‌های استراتژیک را به حملات موثر تبدیل کنید و از برتری‌های کوچک، فشار واقعی بسازید.',
        thumbnailImage: 'https://images.unsplash.com/photo-1543092587-d8b8feaf3628?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/attack-and-strategy-preview.mp4',
        level: client_1.CourseLevel.advanced,
        categorySlug: 'strategy',
        instructorName: 'استاد بابک ولی‌زاده',
        rating: 4.6,
        reviewCount: 164,
        studentCount: 1320,
        duration: '۷ ساعت و ۵۰ دقیقه',
        totalLessons: 9,
        price: 2190000,
        chapters: [
            {
                title: 'پایه‌گذاری حمله',
                lessons: [
                    { title: 'نشانه‌های حمله موفق', duration: '16:15', isPreview: true },
                    { title: 'برتری فضا', duration: '18:25', isPreview: false },
                    { title: 'هماهنگی مهره‌ها', duration: '17:50', isPreview: false },
                ],
            },
            {
                title: 'اجرای حمله',
                lessons: [
                    { title: 'باز کردن خطوط', duration: '20:35', isPreview: false },
                    { title: 'قربانی پوزیسیونی', duration: '21:40', isPreview: false },
                    { title: 'جاگیری مهره‌های سنگین', duration: '16:10', isPreview: false },
                ],
            },
            {
                title: 'پس از حمله',
                lessons: [
                    { title: 'تبدیل برتری', duration: '17:45', isPreview: false },
                    { title: 'مدیریت ضدبازی حریف', duration: '18:30', isPreview: false },
                    { title: 'تحلیل بازی نمونه', duration: '21:15', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'پیام فرجی', rating: 5, comment: 'ترکیب مفاهیم استراتژی و حمله خیلی خوب آموزش داده شده است.' },
            { authorName: 'نگار صادقی', rating: 4, comment: 'دوره‌ای عمیق و مفید برای سطح بالاتر.' },
        ],
    },
    {
        title: 'چهار اصل استراتژیک',
        slug: 'four-strategic-principles',
        description: 'چهار اصل کلیدی استراتژی شامل فضا، ساختار، فعالیت مهره‌ها و امنیت شاه به صورت کاربردی و قابل‌اجرا آموزش داده می‌شوند.',
        thumbnailImage: 'https://images.unsplash.com/photo-1611195974226-a6a9be9dd763?auto=format&fit=crop&w=1200&q=80',
        previewVideoUrl: 'https://example.com/videos/four-strategic-principles-preview.mp4',
        level: client_1.CourseLevel.beginner,
        categorySlug: 'strategy',
        instructorName: 'استاد فرهاد سلطانی',
        rating: 4.7,
        reviewCount: 288,
        studentCount: 2780,
        duration: '۵ ساعت و ۵۵ دقیقه',
        totalLessons: 8,
        price: 1590000,
        chapters: [
            {
                title: 'فضا و کنترل',
                lessons: [
                    { title: 'فضا چیست؟', duration: '13:40', isPreview: true },
                    { title: 'کنترل خانه‌های کلیدی', duration: '16:50', isPreview: false },
                    { title: 'محدودسازی حریف', duration: '15:05', isPreview: false },
                ],
            },
            {
                title: 'مهره‌های فعال',
                lessons: [
                    { title: 'بد و خوب بودن مهره‌ها', duration: '17:20', isPreview: false },
                    { title: 'بهترین خانه برای مهره', duration: '15:45', isPreview: false },
                    { title: 'تعویض‌های استراتژیک', duration: '18:15', isPreview: false },
                ],
            },
            {
                title: 'امنیت و ساختار',
                lessons: [
                    { title: 'امنیت شاه', duration: '14:55', isPreview: false },
                    { title: 'جمع‌بندی اصول', duration: '16:30', isPreview: false },
                ],
            },
        ],
        reviews: [
            { authorName: 'رویا شفیعی', rating: 5, comment: 'برای درک ساده و روشن اصول استراتژیک عالی بود.' },
            { authorName: 'احمد کریمی', rating: 4, comment: 'مطالب دوره روان و قابل‌فهم ارائه شده‌اند.' },
        ],
    },
];
async function main() {
    if (!process.env.DATABASE_URL) {
        throw new Error('DATABASE_URL is required to run the seed script.');
    }
    await prisma.lesson.deleteMany();
    await prisma.chapter.deleteMany();
    await prisma.review.deleteMany();
    await prisma.course.deleteMany();
    await prisma.category.deleteMany();
    await prisma.instructor.deleteMany();
    const categoryMap = new Map();
    for (const category of categories) {
        const createdCategory = await prisma.category.create({
            data: category,
        });
        categoryMap.set(category.slug, { id: createdCategory.id });
    }
    const instructorMap = new Map();
    for (const instructor of instructors) {
        const createdInstructor = await prisma.instructor.create({
            data: instructor,
        });
        instructorMap.set(instructor.name, { id: createdInstructor.id });
    }
    for (const course of courseSeeds) {
        const createdCourse = await prisma.course.create({
            data: {
                title: course.title,
                slug: course.slug,
                description: course.description,
                thumbnailImage: course.thumbnailImage,
                thumbnailFileName: `${course.slug}.jpg`,
                thumbnailMimeType: 'image/jpeg',
                thumbnailSize: 250000,
                previewVideoUrl: course.previewVideoUrl,
                level: course.level,
                duration: course.duration,
                totalLessons: course.totalLessons,
                price: course.price,
                rating: course.rating,
                reviewCount: course.reviewCount,
                studentCount: course.studentCount,
                isPublished: true,
                categoryId: categoryMap.get(course.categorySlug).id,
                instructorId: instructorMap.get(course.instructorName).id,
            },
        });
        for (const [chapterIndex, chapter] of course.chapters.entries()) {
            const createdChapter = await prisma.chapter.create({
                data: {
                    title: chapter.title,
                    order: chapterIndex + 1,
                    courseId: createdCourse.id,
                },
            });
            await prisma.lesson.createMany({
                data: chapter.lessons.map((lesson, lessonIndex) => ({
                    title: lesson.title,
                    duration: lesson.duration,
                    videoUrl: `https://example.com/videos/${course.slug}/lesson-${lessonIndex + 1}.mp4`,
                    order: lessonIndex + 1,
                    isPreview: lesson.isPreview,
                    chapterId: createdChapter.id,
                })),
            });
        }
        await prisma.review.createMany({
            data: course.reviews.map((review) => ({
                authorName: review.authorName,
                rating: review.rating,
                comment: review.comment,
                courseId: createdCourse.id,
            })),
        });
    }
}
main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
});
