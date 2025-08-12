import { getDb, properties, propertyTranslations, blogs, blogTranslations, admins } from './index';
import { createId } from '@paralleldrive/cuid2';
import { eq, sql } from 'drizzle-orm';

/**
 * Seed the database with sample data
 */
export async function seedAllData() {
  console.log('🌱 Starting comprehensive database seeding...');
  
  try {
    const db = getDb();
    
    // First, create or get admin user
    console.log('👤 Creating/getting admin user...');
    let adminUser;
    try {
      adminUser = await db.insert(admins).values({
        username: 'victoria',
        passwordHash: '$2b$10$dummy.hash.for.demo.purposes', // In production, use proper bcrypt
        email: 'victoria@vlrealestate.com',
      }).returning();
      console.log(`✅ Created admin: ${adminUser[0].username}`);
    } catch (error) {
      const errorStr = error.toString() + (error.cause?.toString() || '');
      if (errorStr.includes('UNIQUE constraint failed') || errorStr.includes('SQLITE_CONSTRAINT')) {
        console.log('ℹ️  Admin user already exists, fetching existing user...');
        adminUser = await db.select().from(admins).where(eq(admins.email, 'victoria@vlrealestate.com')).limit(1);
        console.log(`✅ Using existing admin: ${adminUser[0].username}`);
      } else {
        throw error;
      }
    }
    
    // Check if properties already exist
    const existingProperties = await db.select().from(properties).limit(1);
    if (existingProperties.length > 0) {
      console.log('ℹ️  Properties already exist in database, skipping property seeding...');
      console.log('✅ Use clearAllData() if you want to reseed properties');
    } else {
      console.log('⚠️  No seed data available - properties must be added manually or via API');
      console.log('ℹ️  Consider creating a dedicated seed data file if seeding is needed');
    }

    // Check if blogs already exist
    const existingBlogs = await db.select().from(blogs).limit(1);
    if (existingBlogs.length > 0) {
      console.log('ℹ️  Blogs already exist in database, skipping blog seeding...');
      console.log('✅ Use clearAllData() if you want to reseed blogs');
    } else {
      // Seed blogs with multilingual support
      console.log('📝 Seeding blog posts with multilingual support...');
      
      const sampleBlog = {
        slug: 'dubai-real-estate-market-2024',
        type: 'Market Analysis',
        readingMinutes: 8,
        featuredImageUrl: '/placeholder.svg?height=400&width=800&text=Market+Analysis',
        translations: {
          en: {
            title: 'Dubai Real Estate Market Outlook 2024: What Investors Need to Know',
            excerpt: 'Discover the latest trends, opportunities, and strategic insights for Dubai\'s booming real estate market in 2024.',
            content: `
              <h2>Dubai's Real Estate Market Continues to Thrive</h2>
              <p>As we move into 2024, Dubai's real estate market shows no signs of slowing down. The emirate has become a global hub for investors seeking stable returns and long-term growth potential.</p>
              
              <h3>Key Market Trends</h3>
              <ul>
                <li><strong>Luxury Segment Growth:</strong> High-end properties continue to attract international buyers</li>
                <li><strong>Expo 2020 Legacy:</strong> Infrastructure improvements driving property values</li>
                <li><strong>Golden Visa Impact:</strong> Increased demand from long-term investors</li>
                <li><strong>Digital Transformation:</strong> Smart city initiatives enhancing property appeal</li>
              </ul>
              
              <h3>Investment Opportunities</h3>
              <p>Areas like Downtown Dubai, Palm Jumeirah, and Business Bay remain prime investment locations. However, emerging districts like Dubai Hills Estate and Dubai Creek Harbour are gaining significant attention from savvy investors.</p>
              
              <h3>Market Predictions</h3>
              <p>Experts predict continued growth in property values, with luxury villas and waterfront apartments leading the charge. The rental market is also expected to remain strong, providing excellent yields for property investors.</p>
            `,
            metaTitle: 'Dubai Real Estate Market 2024: Investment Guide & Trends',
            metaDescription: 'Comprehensive analysis of Dubai\'s real estate market in 2024. Expert insights on investment opportunities, market trends, and strategic advice for property investors.'
          },
          ar: {
            title: 'توقعات سوق العقارات في دبي 2024: ما يحتاج المستثمرون إلى معرفته',
            excerpt: 'اكتشف أحدث الاتجاهات والفرص والرؤى الاستراتيجية لسوق العقارات المزدهر في دبي لعام 2024.',
            content: `
              <h2>سوق العقارات في دبي يستمر في الازدهار</h2>
              <p>مع دخولنا عام 2024، لا يظهر سوق العقارات في دبي أي علامات على التباطؤ. أصبحت الإمارة مركزاً عالمياً للمستثمرين الباحثين عن عوائد مستقرة وإمكانات نمو طويلة المدى.</p>
              
              <h3>الاتجاهات الرئيسية للسوق</h3>
              <ul>
                <li><strong>نمو القطاع الفاخر:</strong> العقارات عالية الجودة تستمر في جذب المشترين الدوليين</li>
                <li><strong>إرث إكسبو 2020:</strong> التحسينات البنية التحتية تدفع قيم العقارات</li>
                <li><strong>تأثير التأشيرة الذهبية:</strong> زيادة الطلب من المستثمرين طويلي المدى</li>
                <li><strong>التحول الرقمي:</strong> مبادرات المدينة الذكية تعزز جاذبية العقارات</li>
              </ul>
              
              <h3>فرص الاستثمار</h3>
              <p>المناطق مثل وسط مدينة دبي وجزيرة النخلة وخليج الأعمال تظل مواقع استثمارية رئيسية. ومع ذلك، المناطق الناشئة مثل عقار تلال دبي وميناء خور دبي تجذب انتباهاً كبيراً من المستثمرين الأذكياء.</p>
              
              <h3>توقعات السوق</h3>
              <p>يتوقع الخبراء استمرار نمو قيم العقارات، مع قيادة الفيلات الفاخرة والشقق المطلة على البحر. من المتوقع أيضاً أن يظل سوق الإيجار قوياً، مما يوفر عوائد ممتازة لمستثمري العقارات.</p>
            `,
            metaTitle: 'سوق العقارات في دبي 2024: دليل الاستثمار والاتجاهات',
            metaDescription: 'تحليل شامل لسوق العقارات في دبي لعام 2024. رؤى الخبراء حول فرص الاستثمار واتجاهات السوق والنصائح الاستراتيجية لمستثمري العقارات.'
          },
          ru: {
            title: 'Перспективы рынка недвижимости Дубая 2024: Что нужно знать инвесторам',
            excerpt: 'Откройте для себя последние тенденции, возможности и стратегические идеи для процветающего рынка недвижимости Дубая в 2024 году.',
            content: `
              <h2>Рынок недвижимости Дубая продолжает процветать</h2>
              <p>По мере того, как мы вступаем в 2024 год, рынок недвижимости Дубая не показывает никаких признаков замедления. Эмират стал глобальным центром для инвесторов, ищущих стабильную прибыль и долгосрочный потенциал роста.</p>
              
              <h3>Ключевые рыночные тенденции</h3>
              <ul>
                <li><strong>Рост люксового сегмента:</strong> Элитная недвижимость продолжает привлекать международных покупателей</li>
                <li><strong>Наследие Экспо 2020:</strong> Улучшения инфраструктуры стимулируют рост стоимости недвижимости</li>
                <li><strong>Влияние Золотой визы:</strong> Увеличение спроса от долгосрочных инвесторов</li>
                <li><strong>Цифровая трансформация:</strong> Инициативы умного города повышают привлекательность недвижимости</li>
              </ul>
              
              <h3>Инвестиционные возможности</h3>
              <p>Районы, такие как Даунтаун Дубай, Пальм Джумейра и Бизнес Бэй, остаются основными инвестиционными локациями. Однако развивающиеся районы, такие как Dubai Hills Estate и Dubai Creek Harbour, привлекают значительное внимание опытных инвесторов.</p>
              
              <h3>Рыночные прогнозы</h3>
              <p>Эксперты предсказывают продолжение роста стоимости недвижимости, с люксовыми виллами и апартаментами с видом на море в качестве лидеров. Ожидается, что рынок аренды также останется сильным, обеспечивая отличную доходность для инвесторов в недвижимость.</p>
            `,
            metaTitle: 'Рынок недвижимости Дубая 2024: Инвестиционное руководство и тенденции',
            metaDescription: 'Комплексный анализ рынка недвижимости Дубая в 2024 году. Экспертные идеи об инвестиционных возможностях, рыночных тенденциях и стратегических советах для инвесторов в недвижимость.'
          }
        }
      };

      // Insert blog
      const insertedBlog = await db.insert(blogs).values({
        slug: sampleBlog.slug,
        type: sampleBlog.type,
        readingMinutes: sampleBlog.readingMinutes,
        authorId: adminUser[0].id,
        featuredImageUrl: sampleBlog.featuredImageUrl,
        isPublished: true,
        publishedAt: sql`(unixepoch())`, // Current timestamp using SQL function
        viewCount: Math.floor(Math.random() * 1000) + 100, // Random view count
      }).returning();

      // Insert translations for all three languages
      for (const [language, translation] of Object.entries(sampleBlog.translations)) {
        await db.insert(blogTranslations).values({
          blogId: insertedBlog[0].id,
          language: language,
          title: translation.title,
          content: translation.content,
          excerpt: translation.excerpt,
          metaTitle: translation.metaTitle,
          metaDescription: translation.metaDescription,
        });
        console.log(`✅ Seeded ${language} translation for blog: ${translation.title}`);
      }

      console.log(`✅ Seeded blog with 3 language translations: ${sampleBlog.slug}`);
    }

    console.log(`🎉 Database seeding completed successfully!`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

/**
 * Clear all data from the database
 */
export async function clearAllData() {
  try {
    const db = getDb();
    await db.delete(blogTranslations);
    await db.delete(blogs);
    await db.delete(propertyTranslations);
    await db.delete(properties);
    await db.delete(admins);
    console.log('🧹 Cleared all data from database');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

/**
 * Clear all properties from the database
 */
export async function clearProperties() {
  try {
    const db = getDb();
    await db.delete(propertyTranslations);
    await db.delete(properties);
    console.log('🧹 Cleared all properties from database');
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    throw error;
  }
}

/**
 * Backward compatibility function
 */
export async function seedProperties() {
  console.log('⚠️  This function is deprecated. Use seedAllData() instead.');
  return seedAllData();
}

/**
 * Run the seeding process
 */
if (require.main === module) {
  seedAllData()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}
