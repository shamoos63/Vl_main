import { getProperties, getFeaturedProperties, getPropertyBySlug as getPropertyBySlugFromDb, getPropertyById as getPropertyByIdFromDb, searchProperties, convertToCurrentPropertyFormat, type PropertyFilters } from './db/utils';
import { type Property } from './properties-data';

/**
 * Service layer for property data - DATABASE ONLY (no fallback data)
 * This service requires a properly configured database connection.
 */
class PropertyService {
  /**
   * Check if database is properly configured
   */
  private static checkDatabaseConfig() {
    if (typeof window !== 'undefined') {
      throw new Error('PropertyService should only be used on the server side');
    }
    if (!process.env.TURSO_DATABASE_URL) {
      throw new Error('Database not configured. TURSO_DATABASE_URL environment variable is required.');
    }
  }

  /**
   * Check if we're in a server environment (less strict for development)
   */
  private static isServerEnvironment(): boolean {
    return typeof window === 'undefined';
  }

  /**
   * Get all properties with filtering
   */
  static async getAllProperties(filters?: PropertyFilters & { limit?: number; offset?: number }): Promise<Property[]> {
    this.checkDatabaseConfig();
    
    try {
      console.log('🔄 Fetching properties from database...');
      const dbProperties = await getProperties(filters, filters?.limit, filters?.offset);
      console.log(`✅ Found ${dbProperties.length} properties in database`);
      return dbProperties.map(convertToCurrentPropertyFormat);
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to fetch properties from database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get featured properties
   */
  static async getFeaturedProperties(limit = 6, language?: 'en' | 'ar' | 'ru'): Promise<Property[]> {
    this.checkDatabaseConfig();
    
    try {
      console.log('🔄 Fetching featured properties from database...');
      const dbProperties = await getFeaturedProperties(limit, language);
      console.log(`✅ Found ${dbProperties.length} featured properties in database`);
      return dbProperties.map(convertToCurrentPropertyFormat);
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to fetch featured properties from database: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get property by ID
   */
  static async getPropertyById(id: number, language?: 'en' | 'ar' | 'ru'): Promise<Property | null> {
    this.checkDatabaseConfig();
    
    try {
      const dbProperty = await getPropertyByIdFromDb(id, language);
      return dbProperty ? convertToCurrentPropertyFormat(dbProperty) : null;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to fetch property by ID ${id}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get property by slug (for dynamic routes)
   */
  static async getPropertyBySlug(slug: string, language?: 'en' | 'ar' | 'ru'): Promise<Property | null> {
    this.checkDatabaseConfig();
    
    try {
      const dbProperty = await getPropertyBySlugFromDb(slug, language);
      return dbProperty ? convertToCurrentPropertyFormat(dbProperty) : null;
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to fetch property by slug '${slug}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Search properties
   */
  static async searchProperties(searchTerm: string, language?: 'en' | 'ar' | 'ru'): Promise<Property[]> {
    this.checkDatabaseConfig();
    
    try {
      const dbProperties = await searchProperties(searchTerm, language);
      return dbProperties.map(convertToCurrentPropertyFormat);
    } catch (error) {
      console.error('❌ Database error:', error);
      throw new Error(`Failed to search properties for '${searchTerm}': ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }



  /**
   * Check if database is available
   */
  static isDatabaseAvailable(): boolean {
    return typeof window === 'undefined' && Boolean(process.env.TURSO_DATABASE_URL);
  }
}

// Export convenience functions
export const getAllPropertiesService = PropertyService.getAllProperties.bind(PropertyService);
export const getFeaturedPropertiesService = PropertyService.getFeaturedProperties.bind(PropertyService);
export const getPropertyByIdService = PropertyService.getPropertyById.bind(PropertyService);
export const getPropertyBySlugService = PropertyService.getPropertyBySlug.bind(PropertyService);
export const getPropertyBySlug = PropertyService.getPropertyBySlug.bind(PropertyService);
export const searchPropertiesService = PropertyService.searchProperties.bind(PropertyService);

// Export the main service class
export { PropertyService };